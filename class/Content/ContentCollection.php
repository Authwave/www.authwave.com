<?php
namespace Authwave\Content;

use IteratorAggregate;
use Traversable;

/** Expose Markdown files as lazy, dotted Binder keys matching their hierarchy. */
class ContentCollection implements IteratorAggregate {
	/** @var array<string, ContentBlock> */
	private array $blocks = [];
	private ContentRepository $repository;

	public function __construct(
		private string $prefix = "home",
		private string $directory = __DIR__ . "/../../data/content",
	) {
		$this->repository = new ContentRepository($directory);
	}

	public function getIterator():Traversable {
		foreach(glob("$this->directory/$this->prefix--*.md") ?: [] as $file) {
			$name = basename($file, ".md");
			$key = "content." . str_replace("--", ".", $name);
			// Defer Markdown rendering until Binder requests each value.
			yield "$key.heading" => fn() => $this->block($name)->getHeading();
			yield "$key.firstParagraph" => fn() => $this->block($name)->getFirstParagraph();
			yield "$key.bodyHTML" => fn() => $this->block($name)->getBodyHTML();
		}
	}

	private function block(string $name):ContentBlock {
		return $this->blocks[$name] ??= new ContentBlock($this->repository, $name);
	}
}
