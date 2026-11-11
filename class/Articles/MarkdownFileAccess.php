<?php
namespace Authwave\Articles;

use GT\FileCache\FileAccess;
use GT\FileCache\FileNotFoundException;
use RuntimeException;

/** Let GT FileCache store readable Markdown rather than serialised PHP strings. */
class MarkdownFileAccess extends FileAccess {
	public function __construct(private readonly string $directory) {
		parent::__construct($directory);
	}

	public function getData(string $name):mixed {
		$path = "$this->directory/" . rawurlencode($name);

		if(!is_file($path)) {
			throw new FileNotFoundException($path);
		}

		$content = file_get_contents($path);

		if($content === false) {
			throw new RuntimeException("Unable to read article cache: $path");
		}

		return $content;
	}

	public function setData(string $name, mixed $value):void {
		if(!is_dir($this->directory) && !mkdir($this->directory, 0775, true) && !is_dir($this->directory)) {
			throw new RuntimeException("Unable to create article cache directory.");
		}

		$path = "$this->directory/" . rawurlencode($name);
		$temp = tempnam($this->directory, ".article-");

		if($temp === false) {
			throw new RuntimeException("Unable to create article cache file.");
		}

		try {
			if(file_put_contents($temp, $value) === false || !rename($temp, $path)) {
				throw new RuntimeException("Unable to write article cache: $path");
			}
		}
		finally {
			if(is_file($temp)) {
				unlink($temp);
			}
		}
	}
}
