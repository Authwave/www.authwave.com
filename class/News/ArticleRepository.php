<?php
namespace Authwave\News;

use DateTimeImmutable;
use RuntimeException;

/** File-backed catalogue. Preview content is separate from published articles. */
class ArticleRepository {
	public function __construct(private string $directory = __DIR__ . "/../../data/news", private bool $preview = false) {}

	/** @return list<array<string, string>> */
	public function all():array {
		$published = "$this->directory/articles.json";
		if(is_file($published)) {
			$articles = $this->read($published);
		}
		elseif($this->preview) {
			$examples = $this->read("$this->directory/preview.json");
			if(!$examples) return [];
			$articles = [];
			// Twelve reviewable pages without pretending these are published posts.
			for($index = 0; $index < 108; $index++) {
				$article = $examples[$index % count($examples)];
				$article["published"] = (new DateTimeImmutable("2026-10-27"))->modify("-$index days")->format("Y-m-d");
				$articles []= $article;
			}
		}
		else {
			$articles = [];
		}

		foreach($articles as $article) {
			foreach(["slug", "title", "summary", "category", "published"] as $key) {
				if(!isset($article[$key]) || !is_string($article[$key]) || $article[$key] === "") {
					throw new RuntimeException("News articles require a non-empty $key.");
				}
			}
			if(!isset(ArticleListing::CATEGORIES[$article["category"]])
			|| !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D', $article["slug"])) {
				throw new RuntimeException("Invalid news category or slug.");
			}
			$date = DateTimeImmutable::createFromFormat("!Y-m-d", $article["published"]);
			if(!$date || $date->format("Y-m-d") !== $article["published"]) {
				throw new RuntimeException("News publication dates must be valid YYYY-MM-DD dates.");
			}
		}
		usort($articles, static fn(array $a, array $b) => strcmp($b["published"], $a["published"]));
		return $articles;
	}

	private function read(string $path):array {
		$data = json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
		if(!is_array($data) || !array_is_list($data)) {
			throw new RuntimeException("News catalogues must contain a JSON list.");
		}
		return $data;
	}
}
