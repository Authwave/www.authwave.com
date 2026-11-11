<?php
namespace Authwave\Articles;

use DateTimeImmutable;

readonly class Article {
	public string $url;
	public string $categoryLabel;
	public string $categorySlug;
	public string $publishedDate;
	public string $publishedLabel;

	public function __construct(
		public string $slug,
		public string $title,
		public string $summary,
		public ArticleCategory $category,
		public DateTimeImmutable $published,
		public string $cover,
		public ArticleContent $content,
	) {
		$this->url = "/articles/" . rawurlencode($slug) . "/";
		$this->categoryLabel = $category->label();
		$this->categorySlug = $category->value;
		$this->publishedDate = $published->format("Y-m-d");
		$this->publishedLabel = $published->format("j M Y");
	}
}
