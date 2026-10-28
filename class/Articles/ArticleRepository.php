<?php
namespace Authwave\Articles;

use Authwave\Content\MarkdownRenderer;
use DateTimeImmutable;
use RuntimeException;

/** Every article's metadata and body come from one dated Markdown file. */
class ArticleRepository {
	private ?array $catalogue = null;
	private array $markdown = [];
	private MarkdownRenderer $renderer;

	public function __construct(private string $directory = __DIR__ . "/../../data/articles") {
		$this->renderer = new MarkdownRenderer();
	}

	/** @return list<array<string, string>> */
	public function all():array {
		if($this->catalogue !== null) return $this->catalogue;
		$articles = [];
		$files = glob("$this->directory/*.md") ?: [];
		sort($files, SORT_STRING);
		foreach($files as $file) {
			$name = basename($file);
			if(!preg_match('/^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/D', $name, $matches)) {
				throw new RuntimeException("Article filename must be YYYY-MM-DD-slug.md: $name");
			}
			[, $published, $slug] = $matches;
			$date = DateTimeImmutable::createFromFormat("!Y-m-d", $published);
			if(!$date || $date->format("Y-m-d") !== $published) {
				throw new RuntimeException("Invalid article publication date: $name");
			}
			if(isset($this->markdown[$slug])) throw new RuntimeException("Article URL slugs must be unique: $slug");
			$source = file_get_contents($file);
			if($source === false) throw new RuntimeException("Unable to read article: $name");
			$parsed = $this->renderer->parse($source);
			$metadata = $parsed["metadata"];
			if(!is_array($metadata)) throw new RuntimeException("Article requires YAML front matter: $name");
			foreach(["title", "summary", "category"] as $key) {
				if(!isset($metadata[$key]) || !is_string($metadata[$key]) || trim($metadata[$key]) === "") {
					throw new RuntimeException("Article requires a non-empty $key in front matter: $name");
				}
			}
			if(!isset(ArticleListing::CATEGORIES[$metadata["category"]])) throw new RuntimeException("Unknown article category: $name");
			if(trim($parsed["body"]) === "") throw new RuntimeException("Article body is empty: $name");
			$articles []= ["slug" => $slug, "published" => $published, "title" => $metadata["title"], "summary" => $metadata["summary"], "category" => $metadata["category"]];
			$this->markdown[$slug] = $parsed["body"];
		}
		usort($articles, static fn($a, $b) => strcmp($b["published"], $a["published"]) ?: strcmp($a["slug"], $b["slug"]));
		return $this->catalogue = $articles;
	}

	public function find(string $slug):?array {
		foreach($this->all() as $article) {
			if($article["slug"] === $slug) return $article;
		}
		return null;
	}

	public function content(string $slug):?string {
		if(!$this->find($slug)) return null;
		return $this->renderer->render($this->markdown[$slug]);
	}

	public function related(string $slug, int $limit = 3):array {
		if($limit < 1) return [];
		$related = [];
		foreach($this->all() as $article) {
			if($article["slug"] === $slug) continue;
			$related []= ArticleView::data($article);
			if(count($related) === $limit) break;
		}
		return $related;
	}
}
