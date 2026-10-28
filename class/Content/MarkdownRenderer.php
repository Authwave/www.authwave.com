<?php
namespace Authwave\Content;

use Gt\Dom\HTMLDocument;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\Attributes\AttributesExtension;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterExtension;
use League\CommonMark\MarkdownConverter;

/** CommonMark for repository-authored content, following TrackShift's setup. */
class MarkdownRenderer {
	private MarkdownConverter $converter;
	private FrontMatterExtension $frontMatter;

	public function __construct() {
		$environment = new Environment([
			"html_input" => "allow",
			"allow_unsafe_links" => false,
		]);
		$environment->addExtension(new CommonMarkCoreExtension());
		$environment->addExtension(new AttributesExtension());
		$this->frontMatter = new FrontMatterExtension(new SymfonyYamlFrontMatterParser());
		$environment->addExtension($this->frontMatter);
		$this->converter = new MarkdownConverter($environment);
	}

	/** @return array{metadata: mixed, body: string} */
	public function parse(string $markdown):array {
		$input = $this->frontMatter->getFrontMatterParser()->parse($markdown);
		return ["metadata" => $input->getFrontMatter(), "body" => $input->getContent()];
	}

	public function render(string $markdown):string {
		$document = new HTMLDocument((string)$this->converter->convert($markdown));
		foreach($document->querySelectorAll('a[href*="://"]') as $link) {
			$link->setAttribute("target", "_blank");
			$relations = preg_split('/\s+/', trim($link->getAttribute("rel") ?? ""), flags: PREG_SPLIT_NO_EMPTY);
			$relations []= "noopener";
			$link->setAttribute("rel", implode(" ", array_unique($relations)));
		}
		return $document->body->innerHTML;
	}
}
