<?php
namespace Authwave\Articles;

/** Filtering, pagination and presentation data, independent of HTTP or templates. */
class ArticleListing {
	const CATEGORIES = ["guides" => "Guides", "tutorials" => "Tutorials", "product" => "Product", "engineering" => "Engineering"];
	public readonly ?string $category;
	public readonly array $articles;
	public readonly int $total;
	public readonly int $page;
	public readonly int $pageCount;

	public function __construct(array $articles, array $query, public readonly int $pageSize = 9) {
		$requested = $query["category"] ?? null;
		$this->category = is_string($requested) && isset(self::CATEGORIES[$requested]) ? $requested : null;
		$filtered = array_values(array_filter($articles, fn($article) => $this->category === null || $article["category"] === $this->category));
		$this->total = count($filtered);
		$this->pageCount = max(1, (int)ceil($this->total / $pageSize));
		$requestedPage = is_scalar($query["page"] ?? null) ? filter_var($query["page"], FILTER_VALIDATE_INT) : false;
		$this->page = max(1, min($this->pageCount, $requestedPage ?: 1));
		$this->articles = array_map(ArticleView::data(...), array_slice($filtered, ($this->page - 1) * $pageSize, $pageSize));
	}

	public function url(int $page = 1, ?string $category = null):string {
		$query = [];
		if($category ?? $this->category) $query["category"] = $category ?? $this->category;
		if($page > 1) $query["page"] = $page;
		return "/articles/" . ($query ? "?" . http_build_query($query, encoding_type: PHP_QUERY_RFC3986) : "") . "#articles-results";
	}

	public function filters():array {
		$filters = [["label" => "All", "url" => "/articles/#articles-results", "selected" => $this->category === null ? "true" : "false", "description" => "Show all articles"]];
		foreach(self::CATEGORIES as $key => $label) {
			$selected = $this->category === $key;
			$filters []= ["label" => $label, "url" => $this->url(category: $key), "selected" => $selected ? "true" : "false", "description" => "Show $label articles" . ($selected ? ", selected" : "")];
		}
		return $filters;
	}

	/** @return list<array<string, int|string>> */
	public function pages(bool $all = false):array {
		$numbers = range(1, $this->pageCount);
		if(!$all && $this->pageCount > 5) {
			$start = max(2, min($this->page - 1, $this->pageCount - 3));
			$numbers = array_values(array_unique([1, ...range($start, $start + 2), $this->pageCount]));
			// Keep the initial reference's compact 1, 2, 3, …, last arrangement.
			if($this->page <= 2) $numbers = [1, 2, 3, $this->pageCount];
		}
		return array_map(fn($number, $index) => [
			"number" => $number,
			"url" => $this->url($number),
			"current" => $number === $this->page ? "page" : "false",
			"label" => "Page $number" . ($number === $this->page ? ", current page" : ""),
			"position" => "order:" . ($number === $this->pageCount ? 100 : ($number === 1 ? 1 : 10 + $index)),
		], $numbers, array_keys($numbers));
	}
}
