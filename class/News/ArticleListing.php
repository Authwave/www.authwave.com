<?php
namespace Authwave\News;

use DateTimeImmutable;

/** Filtering, pagination and presentation data, independent of HTTP or templates. */
class ArticleListing {
	const CATEGORIES = ["guides" => "Guides", "tutorials" => "Tutorials", "product" => "Product", "engineering" => "Engineering"];
	public readonly array $categories;
	public readonly array $articles;
	public readonly int $total;
	public readonly int $page;
	public readonly int $pageCount;

	public function __construct(array $articles, array $query, public readonly int $pageSize = 9) {
		$requested = $query["category"] ?? [];
		$requested = is_array($requested) ? $requested : [$requested];
		$this->categories = array_values(array_filter(array_keys(self::CATEGORIES), static fn($key) => in_array($key, $requested, true)));
		$filtered = array_values(array_filter($articles, fn($article) => !$this->categories || in_array($article["category"], $this->categories, true)));
		$this->total = count($filtered);
		$this->pageCount = max(1, (int)ceil($this->total / $pageSize));
		$requestedPage = is_scalar($query["page"] ?? null) ? filter_var($query["page"], FILTER_VALIDATE_INT) : false;
		$this->page = max(1, min($this->pageCount, $requestedPage ?: 1));
		$this->articles = array_map(static fn($article) => $article + [
			"url" => "/news/" . rawurlencode($article["slug"]) . "/",
			"categoryLabel" => self::CATEGORIES[$article["category"]],
			"publishedLabel" => (new DateTimeImmutable($article["published"]))->format("j M Y"),
		], array_slice($filtered, ($this->page - 1) * $pageSize, $pageSize));
	}

	public function url(int $page = 1, ?array $categories = null):string {
		$query = [];
		if($categories ?? $this->categories) $query["category"] = $categories ?? $this->categories;
		if($page > 1) $query["page"] = $page;
		return "/news/" . ($query ? "?" . http_build_query($query, encoding_type: PHP_QUERY_RFC3986) : "") . "#news-results";
	}

	public function filters():array {
		$filters = [["label" => "All", "url" => $this->url(categories: []), "selected" => $this->categories ? "false" : "true", "description" => "Show all articles"]];
		foreach(self::CATEGORIES as $key => $label) {
			$selected = in_array($key, $this->categories, true);
			$categories = $selected ? array_values(array_diff($this->categories, [$key])) : [...$this->categories, $key];
			$filters []= ["label" => $label, "url" => $this->url(categories: $categories), "selected" => $selected ? "true" : "false", "description" => ($selected ? "Remove " : "Add ") . "$label filter"];
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
