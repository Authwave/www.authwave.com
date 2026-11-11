<?php
namespace Authwave\Articles;

readonly class ArticlePage {
	public function __construct(
		public int $number,
		public string $url,
		public string $current,
		public string $label,
		public string $position,
	) {
	}
}
