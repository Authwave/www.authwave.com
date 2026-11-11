<?php
require dirname(__DIR__) . "/vendor/autoload.php";

use Authwave\Content\MarkdownRenderer;
use Authwave\Articles\ArticleList;
use Authwave\Articles\Article;
use Authwave\Articles\ArticleCategory;
use Authwave\Articles\ArticleRepository;
use Authwave\Articles\ArticleContent;

function check(bool $condition, string $message):void {
	if(!$condition) throw new RuntimeException($message);
}

/** Keep local Markdown fixtures in the test, outside the production loader. */
function repositoryFromDirectory(string $directory):ArticleRepository {
	$source = new readonly class($directory) extends \Authwave\Articles\GitHubArticles {
		public function __construct(private string $directory) {
			parent::__construct("");
		}

		public function all():array {
			$documents = [];
			foreach(glob("$this->directory/*.md") ?: [] as $file) {
				$documents[basename($file)] = file_get_contents($file);
			}
			return $documents;
		}
	};
	return new ArticleRepository($source);
}

$directory = sys_get_temp_dir() . "/authwave-articles-" . bin2hex(random_bytes(6));
mkdir($directory);
$document = static fn(string $title, string $category, string $body):string => "---\ntitle: " . json_encode($title) . "\ncategory: $category\nsummary: A short article summary.\n---\n\n$body\n";
try {
	$table = new Gt\Dom\HTMLDocument((new MarkdownRenderer())->render(
		"| Information | Purpose |\n| --- | --- |\n| **Email** | [Verification](https://example.com/) |\n"
	));
	check($table->querySelector("table thead th")?->textContent === "Information", "Markdown tables must render semantic table headers.");
	check($table->querySelector("table tbody td strong")?->textContent === "Email", "Markdown formatting must work inside table cells.");
	check($table->querySelector("table tbody td a")?->getAttribute("target") === "_blank", "Table links must receive shared external-link processing.");
	$links = new Gt\Dom\HTMLDocument((new MarkdownRenderer())->render(
		'[External](https://example.com/) [Internal](/about/) [Email](mailto:contact@authwave.com) <a href="https://example.org/" rel="author">Author</a>'
	));
	foreach($links->querySelectorAll('a[href*="://"]') as $link) {
		check($link->getAttribute("target") === "_blank", "External Markdown and HTML links must open in a new tab.");
		check(in_array("noopener", explode(" ", $link->getAttribute("rel"))), "External links must isolate the opened tab.");
	}
	check($links->querySelector('[rel="author noopener"]') !== null, "Existing link relations must be preserved.");
	check($links->querySelector('a[href="/about/"]')->getAttribute("target") === null, "Internal links must keep their default target.");
	check($links->querySelector('a[href^="mailto:"]')->getAttribute("target") === null, "Email links must keep their default target.");
	check(count((repositoryFromDirectory($directory))->all()) === 0, "An empty Markdown directory must produce an empty catalogue.");
	$markdown = <<<'MARKDOWN'
## Start here

**Hello** and *welcome*. Read the [source](https://github.com/Authwave/provider).

### A subsection

- First item
- Second item

> A quotation.

```php
echo "<example>";
```

<figure><div class="article-picture" role="img" aria-label="Example"></div><figcaption>A caption.</figcaption></figure>

## Start here

Another section with the same heading.

## Custom section {#custom-section}

An explicitly named anchor.
MARKDOWN;
	file_put_contents("$directory/2026-10-26-hello-world.md", str_replace("category: guides", "category: guides\ncover: integrations.svg", $document("Hello: world", "guides", $markdown)));
	file_put_contents("$directory/2026-10-25-other-article.md", $document("Another article", "engineering", "## Another section\n\nDifferent **body**."));
	file_put_contents("$directory/2026-10-24-third-article.md", $document("Third article", "tutorials", "## Third section\n\nThird body."));
	file_put_contents("$directory/2026-10-23-fourth-article.md", $document("Fourth article", "product", "## Fourth section\n\nFourth body."));
	$repository = repositoryFromDirectory($directory);
	check($repository->all() instanceof ArticleList, "The repository must return an ArticleList.");
	$stored = iterator_to_array($repository->all());
	check($repository->find("hello-world") instanceof Article, "Article lookup must return a typed Article.");
	check($repository->find("hello-world") === $stored[0], "Lookup and iteration must expose the same article object.");
	check(count($stored) === 4 && $stored[0]->slug === "hello-world", "Dated files must be discovered and sorted newest first.");
	check($stored[0]->published->format("Y-m-d") === "2026-10-26" && $stored[0]->title === "Hello: world", "Filename dates and YAML metadata must supply the catalogue.");
	check($stored[0]->cover === "/asset/illustration/articles/integrations.svg", "Selected covers must reach article headers and cards.");
	check($stored[1]->cover === "/asset/illustration/articles/web-screen.svg", "Articles without a cover must use the default illustration.");
	check($stored[0]->url === "/articles/hello-world/", "The date prefix must not change the existing slug URL format.");
	$html = $repository->find("hello-world")->content->html;
	check(str_contains($html, "<strong>Hello</strong>") && str_contains($html, "<em>welcome</em>"), "CommonMark must render inline formatting.");
	check(str_contains($html, "<ul>") && str_contains($html, "<blockquote>") && str_contains($html, '<code class="language-php">'), "Lists, quotes and fenced code must render.");
	check(str_contains($html, "&lt;example&gt;") && str_contains($html, "<figcaption>A caption.</figcaption>"), "Code must be escaped while trusted authored HTML is supported.");
	check(!str_contains($html, "category: guides"), "YAML metadata must not appear in article prose.");
	check(str_contains($repository->find("other-article")->content->html, "Different <strong>body</strong>"), "Each file must supply its own content.");
	$body = $repository->find("hello-world")->content;
	check($body->markdown === $markdown . "\n", "ArticleContent must retain the original Markdown body.");
	check(array_column($body->contents, "url") === ["#article-section-start-here", "#article-section-start-here-2", "#custom-section"], "Generated contents must deduplicate headings and preserve explicit Markdown IDs.");
	check((new ArticleContent("Just a paragraph."))->contents === [], "Content without section headings must have no contents menu.");
	check($repository->find("missing-article") === null, "Unknown articles must not receive fallback content.");
	check($repository->find("../../config") === null, "Content lookup must not accept filesystem traversal.");
	$related = $repository->related("hello-world");
	check(count($related) === 3 && !in_array("hello-world", array_column(iterator_to_array($related), "slug"), true), "Related articles must exclude the current article.");
	check(count($repository->related("hello-world", 0)) === 0, "A zero related limit must return no articles.");

	$invalidFiles = [
		"2026-10-27-invalid-cover.md" => str_replace("category: guides", "category: guides\ncover: ../../config.svg", $document("Title", "guides", "Body")),
		"2026-10-27-missing-cover.md" => str_replace("category: guides", "category: guides\ncover: missing.svg", $document("Title", "guides", "Body")),
		"undated.md" => $document("Title", "guides", "Body"),
		"2026-02-30-invalid-date.md" => $document("Title", "guides", "Body"),
		"2026-10-27-hello-world.md" => $document("Duplicate slug", "guides", "Body"),
		"2026-10-27-no-metadata.md" => "## Body without front matter",
		"2026-10-27-no-summary.md" => "---\ntitle: Title\ncategory: guides\n---\nBody",
		"2026-10-27-bad-category.md" => $document("Title", "invalid", "Body"),
		"2026-10-27-no-body.md" => $document("Title", "guides", ""),
	];
	foreach($invalidFiles as $name => $source) {
		file_put_contents("$directory/$name", $source);
		$rejected = false;
		try { (repositoryFromDirectory($directory))->all(); }
		catch(RuntimeException) { $rejected = true; }
		finally { unlink("$directory/$name"); }
		check($rejected, "Invalid article must be rejected: $name");
	}

	$categories = ArticleCategory::cases();
	$articles = [];
	for($i = 0; $i < 108; $i++) {
		$articles []= new Article("fixture-$i", "Fixture $i", "Summary", $categories[$i % count($categories)], new DateTimeImmutable("2026-10-26"), $stored[0]->cover, new ArticleContent("Body"));
	}
	$list = new ArticleList($articles);
	$listing = $list->paginate();
	check($listing->total === 108 && $listing->pageCount === 12, "Pagination fixture must exercise twelve pages.");
	check(count($listing) === 9, "A page must contain nine cards.");
	check(array_column($listing->pages(), "number") === [1, 2, 3, 12], "Initial pagination must be condensed.");
	check(count($listing->allPages()) === 12, "Expanded pagination must include every page.");
	foreach([1, 5, 6, 12, 120] as $pageCount) {
		$data = array_fill(0, $pageCount * 9, $articles[0]);
		foreach([1, (int)ceil($pageCount / 2), $pageCount] as $page) {
			$view = (new ArticleList($data))->paginate($page);
			$current = array_values(array_filter($view->pages(), fn($link) => $link->current === "page"));
			check(count($current) === 1 && $current[0]->number === $page, "Current page must remain visible in condensed pagination.");
			check(count($view->allPages()) === $pageCount, "Full page list must match its dataset.");
		}
	}
	$filtered = $list->filter(ArticleCategory::Guides)->paginate(2);
	check($filtered->category === ArticleCategory::Guides && $filtered->page === 2, "One category must be selected and paginated.");
	foreach($filtered as $article) {
		check($article instanceof Article && $article->category === ArticleCategory::Guides, "Iteration must expose typed articles from the selected category.");
	}
	check($filtered->filter(ArticleCategory::Engineering)->total === 27, "Changing a filter must use the original collection.");
	check($filtered->filter(null)->total === 108, "Clearing a filter must restore the full collection.");
	check(count($list) === 108 && $list->category === null, "Filtering and pagination must preserve the original list.");
	parse_str(parse_url($filtered->url(3), PHP_URL_QUERY), $query);
	check($query["category"] === "guides" && $query["page"] === "3", "Paging must preserve the category.");
	check($filtered->filters()[0]->url === "/articles/#articles-results", "All must reset the category and page.");
	foreach($filtered->filters() as $filter) {
		if($filter->label !== "Engineering") continue;
		parse_str(parse_url($filter->url, PHP_URL_QUERY), $query);
		check($query["category"] === "engineering" && !isset($query["page"]), "Category changes must replace selection and reset pagination.");
	}
	check($list->paginate(-4)->page === 1, "Negative pages must clamp to the first page.");
	check($list->paginate(1000)->page === 12, "Out-of-range pages must clamp to the last page.");
	check(count($list->paginate(12)) === 9, "The last full page must contain nine articles.");
	check(count((new ArticleList(array_slice($articles, 0, 10)))->paginate(2)) === 1, "A partial last page must contain only remaining articles.");
	$empty = (new ArticleList())->paginate(1000);
	check($empty->total === 0 && count($empty) === 0 && $empty->page === 1, "An empty catalogue must have a valid empty state.");
	try {
		new ArticleList([["title" => "Untyped"]]);
		throw new RuntimeException("Untyped article arrays must be rejected.");
	}
	catch(TypeError) {
	}
	try {
		$list->paginate(pageSize: 0);
		throw new RuntimeException("Zero page sizes must be rejected.");
	}
	catch(InvalidArgumentException) {
	}

}
finally {
	foreach(glob("$directory/*") ?: [] as $file) unlink($file);
	rmdir($directory);
}
echo "Markdown articles, contents, catalogue, filtering and pagination checks passed.\n";
