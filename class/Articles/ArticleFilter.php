<?php
namespace Authwave\Articles;

readonly class ArticleFilter {
	public function __construct(
		public string $label,
		public string $url,
		public string $selected,
		public string $description,
	) {
	}
}
