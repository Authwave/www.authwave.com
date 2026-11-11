<?php
require dirname(__DIR__) . "/vendor/autoload.php";

use Authwave\Articles\ArticleRepository;
use Authwave\Articles\GitHubArticles;

function verify(bool $condition, string $message):void {
	if(!$condition) throw new RuntimeException($message);
}
function response(array $nodes, bool $next = false, ?string $cursor = null):array {
	return ["data" => ["repository" => ["discussions" => [
		"nodes" => $nodes, "pageInfo" => ["hasNextPage" => $next, "endCursor" => $cursor],
	]]]];
}
function discussion(string $title, string $label = "www:guide"):array {
	return ["title" => $title, "body" => "## Introduction\n\nA useful summary.\n\n**Article body**.",
		"createdAt" => "2024-01-02T12:00:00Z", "labels" => ["nodes" => [["name" => $label]]]];
}
$directory = sys_get_temp_dir() . "/authwave-github-" . bin2hex(random_bytes(6));
try {
	$calls = 0;
	$request = function(string $query, array $variables) use (&$calls):array {
		$calls++;
		verify(str_contains($query, 'categoryId: "DIC_kwDODLwVZ84DKUzZ"'), "Only the Articles category must be fetched.");
		if($variables["cursor"] === null) return response([discussion("Hello world: a subtitle")], true, "page-two");
		verify($variables["cursor"] === "page-two", "Pagination cursor must reach the next request.");
		$article = discussion("Other article", "www:tutorial");
		$article["labels"]["nodes"] []= ["name" => "www:label:hosting"];
		return response([$article]);
	};
	$source = new GitHubArticles("test-token", $directory, $request);
	$repository = new ArticleRepository(source: $source);
	$articles = iterator_to_array($repository->all());
	verify($calls === 2 && count($articles) === 2, "All API pages must be included.");
	verify($articles[0]->slug === "hello-world" && $articles[0]->title === "Hello world: a subtitle", "URLs must omit subtitles while keeping the full title.");
	verify($articles[0]->published->format("Y-m-d") === "2024-01-02" && $articles[0]->summary === "A useful summary.", "Discussion metadata must supply the date and summary.");
	verify($articles[0]->category->value === "guides" && $articles[1]->category->value === "tutorials", "GitHub labels must map to local categories.");
	verify($articles[0]->cover === "/asset/illustration/articles/web-screen.svg", "Missing illustration labels must use the default cover.");
	verify($articles[1]->cover === "/asset/illustration/articles/hosting.svg", "Illustration labels must reach the typed article cover.");
	verify(str_contains($repository->find("hello-world")->content->html, "<strong>Article body</strong>"), "Discussion Markdown must render.");
	$files = glob("$directory/*.md");
	verify(count($files) === 2 && str_starts_with(file_get_contents($files[0]), "---\n"), "GT FileCache must write plain Markdown files.");
	(new GitHubArticles("test-token", $directory, $request))->all();
	verify($calls === 2, "A fresh cache must avoid all API calls.");
	$failing = static function():array { throw new RuntimeException("API unavailable"); };
	verify(count((new GitHubArticles("test-token", $directory, $failing, -1))->all()) === 2, "Expired cache must survive an API failure.");
	$edited = discussion("Hello world: a subtitle", "www:engineering");
	$edited["labels"]["nodes"] []= ["name" => "www:label:security"];
	$edited["body"] = "## Changed\n\nUpdated summary and body.";
	$repository = new ArticleRepository(source: new GitHubArticles("test-token", $directory, fn() => response([$edited]), -1));
	verify(count($repository->all()) === 1 && $repository->find("other-article") === null, "Removed discussions must disappear even when old Markdown files remain.");
	verify(str_contains($repository->find("hello-world")->content->html, "Updated summary") && $repository->find("hello-world")->category === \Authwave\Articles\ArticleCategory::Engineering, "Discussion edits and label changes must refresh together.");
	verify($repository->find("hello-world")->cover === "/asset/illustration/articles/security.svg", "Label changes must refresh cached article covers.");
	foreach([response([discussion("Bad", "unrelated")]), ["errors" => [["message" => "rate limited"]]], response([], true)] as $bad) {
		$rejected = false;
		try { (new GitHubArticles("test-token", "$directory/invalid", fn() => $bad))->all(); }
		catch(RuntimeException) { $rejected = true; }
		verify($rejected, "Invalid or incomplete API results must not replace the cache.");
	}
	foreach([["www:label:missing"], ["www:label:../hosting"], ["www:label:hosting", "www:label:security"]] as $names) {
		$article = discussion("Invalid cover");
		foreach($names as $name) {
			$article["labels"]["nodes"] []= ["name" => $name];
		}
		$rejected = false;
		try {
			(new GitHubArticles("test-token", "$directory/invalid-cover", fn() => response([$article])))->all();
		}
		catch(RuntimeException) {
			$rejected = true;
		}
		verify($rejected, "Unknown, unsafe or multiple illustration labels must be rejected.");
	}

	$rejected = false;
	try { (new GitHubArticles("test-token", "$directory/empty", $failing))->all(); }
	catch(RuntimeException) { $rejected = true; }
	verify($rejected, "A cold cache failure must be reported.");
	verify((new GitHubArticles("test-token", "$directory/no-articles", fn() => response([])))->all() === [], "An empty category must produce an empty catalogue.");
}
finally {
	if(is_dir($directory)) {
		$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST);
		foreach($iterator as $file) $file->isDir() ? rmdir($file->getPathname()) : unlink($file->getPathname());
		rmdir($directory);
	}
}
echo "GitHub discussion loading, pagination, Markdown caching and failure checks passed.\n";
