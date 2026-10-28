<?php
namespace Authwave\Articles;

use Gt\Dom\HTMLDocument;

/** Add contents links to the HTML rendered by CommonMark. */
class ArticleContent {
	public readonly string $html;
	public readonly array $contents;

	public function __construct(string $html) {
		$document = new HTMLDocument("<article>$html</article>");
		$contents = [];
		$used = [];
		foreach($document->querySelectorAll("h2") as $heading) {
			$title = trim($heading->textContent);
			$slug = trim(preg_replace('/[^a-z0-9]+/', "-", strtolower($title)), "-") ?: "section";
			// Keep explicit Markdown {#anchor} attributes, while still deduplicating.
			$base = $heading->getAttribute("id") ?: "article-section-$slug";
			$id = $base;
			for($suffix = 2; isset($used[$id]); $suffix++) $id = "$base-$suffix";
			$used[$id] = true;
			$heading->id = $id;
			$contents []= ["label" => $title, "url" => "#" . rawurlencode($id)];
		}
		$this->contents = $contents;
		$this->html = $document->querySelector("article")->innerHTML;
	}
}
