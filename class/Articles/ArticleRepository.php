<?php
namespace Authwave\Articles;

use Authwave\Content\MarkdownRenderer;
use DateTimeImmutable;
use RuntimeException;

/** Article metadata and bodies come from cached GitHub discussion Markdown. */
class ArticleRepository {
	private ?ArticleList $catalogue = null;
	private MarkdownRenderer $renderer;

	public function __construct(private GitHubArticles $source) {
		$this->renderer = new MarkdownRenderer();
	}

	public function all():ArticleList {
		if($this->catalogue !== null) {
			return $this->catalogue;
		}

		$articles = [];
		$slugs = [];
		$documents = $this->source->all();
		ksort($documents, SORT_STRING);

		foreach($documents as $name => $source) {
			if(!preg_match('/^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/D', $name, $matches)) {
				throw new RuntimeException("Article filename must be YYYY-MM-DD-slug.md: $name");
			}

			[, $published, $slug] = $matches;
			$date = DateTimeImmutable::createFromFormat("!Y-m-d", $published);

			if(!$date || $date->format("Y-m-d") !== $published) {
				throw new RuntimeException("Invalid article publication date: $name");
			}

			if(isset($slugs[$slug])) {
				throw new RuntimeException("Article URL slugs must be unique: $slug");
			}

			$parsed = $this->renderer->parse($source);
			$metadata = $parsed["metadata"];

			if(!is_array($metadata)) {
				throw new RuntimeException("Article requires YAML front matter: $name");
			}

			foreach(["title", "summary", "category"] as $key) {
				if(!isset($metadata[$key]) || !is_string($metadata[$key]) || trim($metadata[$key]) === "") {
					throw new RuntimeException("Article requires a non-empty $key in front matter: $name");
				}
			}

			$category = ArticleCategory::tryFrom($metadata["category"]);

			if($category === null) {
				throw new RuntimeException("Unknown article category: $name");
			}

			if(trim($parsed["body"]) === "") {
				throw new RuntimeException("Article body is empty: $name");
			}

			$cover = $metadata["cover"] ?? "web-screen.svg";

			if(!is_string($cover) || !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*\.svg$/D', $cover)
				|| !is_file(__DIR__ . "/../../asset/illustration/articles/$cover")) {
				throw new RuntimeException("Unknown article cover: $name");
			}

			$articles []= new Article(
				$slug, $metadata["title"], $metadata["summary"], $category,
				$date, "/asset/illustration/articles/$cover",
				new ArticleContent($parsed["body"], $this->renderer),
			);
			$slugs[$slug] = true;
		}

		usort($articles, fn(Article $a, Article $b) => ($b->published <=> $a->published) ?: strcmp($a->slug, $b->slug));

		return $this->catalogue = new ArticleList($articles);
	}

	public function find(string $slug):?Article {
		return $this->all()->find($slug);
	}

	public function related(string $slug, int $limit = 3):ArticleList {
		return $this->all()->relatedTo($slug, $limit);
	}
}
