<?php
namespace Authwave\Articles;

use Authwave\Content\MarkdownRenderer;
use GT\Dom\HTMLDocument;

/** Own the authored Markdown, rendered HTML and its matching contents links. */
readonly class ArticleContent {
	public string $html;
	/** @var list<ArticleHeading> */
	public array $contents;

	public function __construct(
		public string $markdown,
		MarkdownRenderer $renderer = new MarkdownRenderer(),
	) {
		$html = $renderer->render($markdown);
		$document = new HTMLDocument("<article>$html</article>");
		$contents = [];
		$used = [];
		foreach($document->querySelectorAll("h2") as $heading) {
			$title = trim($heading->textContent);
			$slug = trim(preg_replace('/[^a-z0-9]+/', "-", strtolower($title)), "-") ?: "section";
			// Keep explicit Markdown {#anchor} attributes, while still deduplicating.
			$base = $heading->getAttribute("id") ?: "article-section-$slug";
			$id = $base;
			for($suffix = 2; isset($used[$id]); $suffix++) {
				$id = "$base-$suffix";
			}

			$used[$id] = true;
			$heading->id = $id;
			array_push($contents, new ArticleHeading($title, "#" . rawurlencode($id)));
		}

		$this->contents = $contents;
		$this->html = $document->querySelector("article")->innerHTML;
	}
}
