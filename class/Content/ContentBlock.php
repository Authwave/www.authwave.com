<?php
namespace Authwave\Content;

use Gt\Dom\HTMLDocument;
use Gt\DomTemplate\BindGetter;
use RuntimeException;

/** A Markdown heading, first paragraph and full body, loaded on first access. */
class ContentBlock {
	private ?HTMLDocument $document = null;

	public function __construct(
		private ContentRepository $repository,
		private string $name,
	) {}

	#[BindGetter]
	public function getHeading():string {
		return trim($this->load()->querySelector("h1")->textContent);
	}

	#[BindGetter]
	public function getFirstParagraph():string {
		return $this->load()->querySelector("p")?->innerHTML ?? "";
	}

	#[BindGetter]
	public function getBodyHTML():string {
		$body = new HTMLDocument($this->load()->body->innerHTML);
		$body->querySelector("h1")->remove();
		return $body->body->innerHTML;
	}

	private function load():HTMLDocument {
		if($this->document) return $this->document;
		$html = $this->repository->content($this->name);
		if($html === null) throw new RuntimeException("Missing content block: $this->name");
		$document = new HTMLDocument($html);
		if(!$document->querySelector("h1")) {
			throw new RuntimeException("Content block requires a heading: $this->name");
		}
		return $this->document = $document;
	}
}
