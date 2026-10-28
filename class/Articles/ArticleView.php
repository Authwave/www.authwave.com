<?php
namespace Authwave\Articles;

use DateTimeImmutable;

/** Shared presentation fields for article headers, listings and related cards. */
class ArticleView {
	public static function data(array $article):array {
		return array_merge($article, [
			"url" => "/articles/" . rawurlencode($article["slug"]) . "/",
			"categoryLabel" => ArticleListing::CATEGORIES[$article["category"]],
			"publishedLabel" => (new DateTimeImmutable($article["published"]))->format("j M Y"),
		]);
	}
}
