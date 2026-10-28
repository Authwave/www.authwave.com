<?php
require dirname(__DIR__) . "/vendor/autoload.php";

use Authwave\Content\MarkdownRenderer;
use Authwave\Articles\ArticleListing;
use Authwave\Articles\ArticleRepository;
use Authwave\Articles\ArticleContent;
use Authwave\Articles\ArticleView;

function check(bool $condition, string $message):void {
	if(!$condition) throw new RuntimeException($message);
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
	check((new ArticleRepository($directory))->all() === [], "An empty Markdown directory must produce an empty catalogue.");
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
	file_put_contents("$directory/2026-10-26-hello-world.md", $document("Hello: world", "guides", $markdown));
	file_put_contents("$directory/2026-10-25-other-article.md", $document("Another article", "engineering", "## Another section\n\nDifferent **body**."));
	file_put_contents("$directory/2026-10-24-third-article.md", $document("Third article", "tutorials", "## Third section\n\nThird body."));
	file_put_contents("$directory/2026-10-23-fourth-article.md", $document("Fourth article", "product", "## Fourth section\n\nFourth body."));
	$repository = new ArticleRepository($directory);
	$stored = $repository->all();
	check(count($stored) === 4 && $stored[0]["slug"] === "hello-world", "Dated files must be discovered and sorted newest first.");
	check($stored[0]["published"] === "2026-10-26" && $stored[0]["title"] === "Hello: world", "Filename dates and YAML metadata must supply the catalogue.");
	check(ArticleView::data($stored[0])["url"] === "/articles/hello-world/", "The date prefix must not change the existing slug URL format.");
	$html = $repository->content("hello-world");
	check(str_contains($html, "<strong>Hello</strong>") && str_contains($html, "<em>welcome</em>"), "CommonMark must render inline formatting.");
	check(str_contains($html, "<ul>") && str_contains($html, "<blockquote>") && str_contains($html, '<code class="language-php">'), "Lists, quotes and fenced code must render.");
	check(str_contains($html, "&lt;example&gt;") && str_contains($html, "<figcaption>A caption.</figcaption>"), "Code must be escaped while trusted authored HTML is supported.");
	check(!str_contains($html, "category: guides"), "YAML metadata must not appear in article prose.");
	check(str_contains($repository->content("other-article"), "Different <strong>body</strong>"), "Each file must supply its own content.");
	$body = new ArticleContent($html);
	check(array_column($body->contents, "url") === ["#article-section-start-here", "#article-section-start-here-2", "#custom-section"], "Generated contents must deduplicate headings and preserve explicit Markdown IDs.");
	check((new ArticleContent((new MarkdownRenderer())->render("Just a paragraph.")))->contents === [], "Content without section headings must have no contents menu.");
	check($repository->find("missing-article") === null && $repository->content("missing-article") === null, "Unknown articles must not receive fallback content.");
	check($repository->content("../../config") === null, "Content lookup must not accept filesystem traversal.");
	$related = $repository->related("hello-world");
	check(count($related) === 3 && !in_array("hello-world", array_column($related, "slug"), true), "Related articles must exclude the current article.");
	check($repository->related("hello-world", 0) === [], "A zero related limit must return no articles.");

	$invalidFiles = [
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
		try { (new ArticleRepository($directory))->all(); }
		catch(RuntimeException) { $rejected = true; }
		finally { unlink("$directory/$name"); }
		check($rejected, "Invalid article must be rejected: $name");
	}

	// Twelve-page coverage is independent of how many prototype files exist.
	$categories = ["guides", "tutorials", "product", "product", "engineering", "guides", "guides", "product", "tutorials"];
	$articles = [];
	for($i = 0; $i < 108; $i++) $articles []= array_merge($stored[0], ["slug" => "fixture-$i", "category" => $categories[$i % count($categories)]]);
	$listing = new ArticleListing($articles, []);
	check($listing->total === 108 && $listing->pageCount === 12, "Pagination fixture must exercise twelve pages.");
	check(count($listing->articles) === 9, "A page must contain nine cards.");
	check(array_column($listing->pages(), "number") === [1, 2, 3, 12], "Initial pagination must be condensed.");
	check(count($listing->pages(true)) === 12, "Expanded pagination must include every page.");
	foreach([1, 5, 6, 12, 120] as $pageCount) {
		$data = array_fill(0, $pageCount * 9, $articles[0]);
		foreach([1, (int)ceil($pageCount / 2), $pageCount] as $page) {
			$view = new ArticleListing($data, ["page" => $page]);
			$current = array_values(array_filter($view->pages(), static fn($link) => $link["current"] === "page"));
			check(count($current) === 1 && $current[0]["number"] === $page, "Current page must remain visible in condensed pagination.");
			check(count($view->pages(true)) === $pageCount, "Full page list must match its dataset.");
		}
	}
	$filtered = new ArticleListing($articles, ["category" => "guides", "page" => 2]);
	check($filtered->category === "guides" && $filtered->page === 2, "One category must be selected and paginated.");
	check(count(array_filter($filtered->articles, static fn($article) => $article["category"] !== "guides")) === 0, "Only the selected category must appear.");
	parse_str(parse_url($filtered->url(3), PHP_URL_QUERY), $query);
	check($query["category"] === "guides" && $query["page"] === "3", "Paging must preserve the category.");
	check($filtered->filters()[0]["url"] === "/articles/#articles-results", "All must reset the category and page.");
	foreach($filtered->filters() as $filter) {
		if($filter["label"] !== "Engineering") continue;
		parse_str(parse_url($filter["url"], PHP_URL_QUERY), $query);
		check($query["category"] === "engineering" && !isset($query["page"]), "Category changes must replace selection and reset pagination.");
	}
	foreach(["invalid", ["guides", "engineering"]] as $category) check((new ArticleListing($articles, ["category" => $category]))->category === null, "Unknown or multiple categories must be ignored.");
	foreach(["invalid", -4, ["bad"], "999999999999999999999999999"] as $page) check((new ArticleListing($articles, ["page" => $page]))->page === 1, "Invalid page input must be safe.");
	check((new ArticleListing($articles, ["page" => 1000]))->page === 12, "Out-of-range pages must clamp to the last page.");
	$empty = new ArticleListing([], ["page" => 1000]);
	check($empty->total === 0 && $empty->articles === [] && $empty->page === 1, "An empty catalogue must have a valid empty state.");
}
finally {
	foreach(glob("$directory/*") ?: [] as $file) unlink($file);
	rmdir($directory);
}
echo "Markdown articles, contents, catalogue, filtering and pagination checks passed.\n";
