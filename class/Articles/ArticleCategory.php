<?php
namespace Authwave\Articles;

enum ArticleCategory:string {
	case Guides = "guides";
	case Tutorials = "tutorials";
	case Product = "product";
	case Engineering = "engineering";

	public function label():string {
		return match($this) {
			self::Guides => "Guides",
			self::Tutorials => "Tutorials",
			self::Product => "Product",
			self::Engineering => "Engineering",
		};
	}
}
