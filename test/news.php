<?php
require dirname(__DIR__) . "/vendor/autoload.php";

use Authwave\News\ArticleListing;
use Authwave\News\ArticleRepository;

function check(bool $condition, string $message):void {
	if(!$condition) throw new RuntimeException($message);
}

$articles = (new ArticleRepository(preview: true))->all();
$listing = new ArticleListing($articles, []);
check($listing->total === 108 && $listing->pageCount === 12, "Preview must exercise twelve pages.");
check(count($listing->articles) === 9, "A page must contain nine previews.");
check(array_column($listing->pages(), "number") === [1, 2, 3, 12], "Initial pagination must be condensed.");
check(count($listing->pages(true)) === 12, "Expanded pagination must include every page.");

foreach([1, 5, 6, 12, 120] as $pageCount) {
	$data = array_fill(0, $pageCount * 9, $articles[0]);
	foreach([1, (int)ceil($pageCount / 2), $pageCount] as $page) {
		$view = new ArticleListing($data, ["page" => $page]);
		$current = array_filter($view->pages(), static fn($link) => $link["current"] === "page");
		check(count($current) === 1 && array_values($current)[0]["number"] === $page, "Current page must remain visible in condensed pagination.");
		check(count($view->pages(true)) === $pageCount, "Full page list must match its dataset.");
	}
}

$filtered = new ArticleListing($articles, ["category" => ["guides", "engineering", "invalid", "guides"], "page" => 2]);
check($filtered->categories === ["guides", "engineering"], "Filters must be allowed, unique and canonical.");
check(count($filtered->articles) === 9 && $filtered->page === 2, "Filtered datasets must paginate.");
check(count(array_filter($filtered->articles, static fn($article) => !in_array($article["category"], ["guides", "engineering"], true))) === 0, "Categories must be combined as a union.");
parse_str(parse_url($filtered->url(3), PHP_URL_QUERY), $query);
check($query["category"] === ["guides", "engineering"] && $query["page"] === "3", "Paging must preserve filters.");
check($filtered->url(categories: []) === "/news/#news-results", "Clear must remove categories and reset the page.");
foreach($filtered->filters() as $filter) {
	if($filter["label"] !== "Guides") continue;
	parse_str(parse_url($filter["url"], PHP_URL_QUERY), $query);
	check($query["category"] === ["engineering"] && !isset($query["page"]), "Removing one category must retain others and reset the page.");
}
foreach(["invalid", -4, ["bad"], "999999999999999999999999999"] as $page) {
	check((new ArticleListing($articles, ["page" => $page]))->page === 1, "Invalid page input must be safe.");
}
check((new ArticleListing($articles, ["page" => 1000]))->page === 12, "Out-of-range pages must clamp to the last page.");
$empty = new ArticleListing([], ["page" => 1000]);
check($empty->total === 0 && $empty->articles === [] && $empty->page === 1, "An empty catalogue must render an empty state.");

$directory = sys_get_temp_dir() . "/authwave-news-" . bin2hex(random_bytes(6));
mkdir($directory);
try {
	check((new ArticleRepository($directory))->all() === [], "Preview must be explicitly enabled.");
	file_put_contents("$directory/articles.json", json_encode([$articles[0]], JSON_THROW_ON_ERROR));
	check(count((new ArticleRepository($directory, true))->all()) === 1, "Published articles must replace preview data.");
}
finally {
	@unlink("$directory/articles.json");
	rmdir($directory);
}
echo "News filtering, pagination and catalogue checks passed.\n";
