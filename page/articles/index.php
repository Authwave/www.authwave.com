<?php
use Authwave\Articles\ArticleCategory;
use Authwave\Articles\ArticleRepository;
use GT\Dom\HTMLDocument;
use GT\DomTemplate\Binder;
use GT\Http\ServerRequest;

function go(Binder $binder, ServerRequest $request, HTMLDocument $document, ArticleRepository $repository):void {
	$query = $request->getQueryParams();
	$category = is_string($query["category"] ?? null) ? ArticleCategory::tryFrom($query["category"]) : null;
	$page = is_scalar($query["page"] ?? null) ? filter_var($query["page"], FILTER_VALIDATE_INT) : false;
	$listing = $repository->all()->filter($category)->paginate($page ?: 1);
	$binder->bindData([
		"pageTitle" => "Guides, ideas and updates | Authwave" . ($listing->page > 1 ? " — Page $listing->page" : ""),
		"hasArticles" => $listing->total > 0,
		"hasPagination" => $listing->pageCount > 1,
		"hasMorePages" => $listing->pageCount > 5,
		"pagePickerLabel" => "Show all $listing->pageCount pages",
		"pagePickerPosition" => "order:" . ($listing->page > 3 ? 2 : 90),
		"resultSummary" => $listing->total ? sprintf("Showing %d–%d of %d articles. Page %d of %d.", ($listing->page - 1) * $listing->pageSize + 1, min($listing->page * $listing->pageSize, $listing->total), $listing->total, $listing->page, $listing->pageCount) : "No articles match these filters.",
	]);
	$binder->bindList($listing->filters(), templateName: "articles-filters");
	$binder->bindList($listing, templateName: "articles");
	$binder->bindList($listing->pages(), templateName: "articles-pages");
	$binder->bindList($listing->allPages(), templateName: "articles-all-pages");

	foreach(["previous" => -1, "next" => 1] as $direction => $offset) {
		$link = $document->querySelector(".articles-$direction");
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
