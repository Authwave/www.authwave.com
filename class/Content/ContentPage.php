<?php
namespace Authwave\Content;

use Gt\Dom\HTMLDocument;
use Gt\Http\ResponseStatusException\ClientError\HttpNotFound;

/** Shared page content and metadata for standalone Markdown documents. */
class ContentPage {
	public static function data(string $name):array {
		$html = (new ContentRepository())->content($name);
		if($html === null) throw new HttpNotFound("Content page not found.");
		$content = new HTMLDocument($html);
		$title = trim($content->querySelector("h1")?->textContent ?? ucfirst($name));
		return [
			"pageTitle" => "$title | Authwave",
			"pageDescription" => trim($content->querySelector("p")?->textContent ?? ""),
			"pageContent" => $html,
		];
	}
}
