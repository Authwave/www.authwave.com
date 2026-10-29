<?php
namespace Authwave\Content;

use RuntimeException;

/** Shared Markdown content pages, independent of the article catalogue. */
class ContentRepository {
	private MarkdownRenderer $renderer;

	public function __construct(private string $directory = __DIR__ . "/../../data/content") {
		$this->renderer = new MarkdownRenderer();
	}

	public function content(string $name):?string {
		if(!preg_match('/^[a-z0-9]+(?:-{1,2}[a-z0-9]+)*$/D', $name)) return null;
		$file = "$this->directory/$name.md";
		if(!is_file($file)) return null;
		$markdown = file_get_contents($file);
		if($markdown === false) throw new RuntimeException("Unable to read content: $name");
		return $this->renderer->render($markdown);
	}
}
