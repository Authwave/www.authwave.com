<?php
use Authwave\News\ArticleListing;
use Authwave\News\ArticleRepository;
use Gt\Config\Config;
use Gt\Dom\HTMLDocument;
use Gt\DomTemplate\Binder;
use Gt\Http\ServerRequest;

function go(Binder $binder, ServerRequest $request, Config $config, HTMLDocument $document):void {
	$repository = new ArticleRepository(preview: $config->getBool("news.preview"));
	$listing = new ArticleListing($repository->all(), $request->getQueryParams());
	$binder->bindData([
		"pageTitle" => "Guides, ideas and updates | Authwave" . ($listing->page > 1 ? " — Page $listing->page" : ""),
		"hasArticles" => $listing->total > 0,
		"hasPagination" => $listing->pageCount > 1,
		"hasMorePages" => $listing->pageCount > 5,
		"pagePickerLabel" => "Show all $listing->pageCount pages",
		"pagePickerPosition" => "order:" . ($listing->page > 3 ? 2 : 90),
		"resultSummary" => $listing->total ? sprintf("Showing %d–%d of %d articles. Page %d of %d.", ($listing->page - 1) * $listing->pageSize + 1, min($listing->page * $listing->pageSize, $listing->total), $listing->total, $listing->page, $listing->pageCount) : "No articles match these filters.",
	]);
	$binder->bindList($listing->filters(), templateName: "news-filters");
	$binder->bindList($listing->articles, templateName: "news-articles");
	$binder->bindList($listing->pages(), templateName: "news-pages");
	$binder->bindList($listing->pages(true), templateName: "news-all-pages");

	foreach(["previous" => -1, "next" => 1] as $direction => $offset) {
		$link = $document->querySelector(".news-$direction");
		$disabled = $listing->page + $offset < 1 || $listing->page + $offset > $listing->pageCount;
		if($disabled) {
			$link->removeAttribute("href");
			$link->setAttribute("aria-disabled", "true");
		}
		else {
			$link->setAttribute("href", $listing->url($listing->page + $offset));
		}
	}
}
