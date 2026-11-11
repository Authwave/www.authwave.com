<?php
namespace Authwave\Articles;

readonly class ArticleHeading {
	public function __construct(public string $label, public string $url) {
	}
}
