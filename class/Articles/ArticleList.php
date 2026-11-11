<?php
namespace Authwave\Articles;

use ArrayIterator;
use Countable;
use InvalidArgumentException;
use IteratorAggregate;
use Traversable;
use TypeError;

/**
 * An immutable collection; filtering and pagination return new lists.
 * @implements IteratorAggregate<int, Article>
 */
readonly class ArticleList implements Countable, IteratorAggregate {
	/** @var list<Article> */
	private array $items;
	/** @var list<Article> */
	private array $selected;
	public int $total;
	public int $page;
	public int $pageCount;

	/** @param iterable<Article> $articles */
	public function __construct(
		iterable $articles = [],
		public ?ArticleCategory $category = null,
		public int $pageSize = PHP_INT_MAX,
		int $page = 1,
	) {
		if($pageSize < 1) {
			throw new InvalidArgumentException("Article page size must be positive.");
		}

		$items = [];
		$selected = [];
		foreach($articles as $article) {
			if(!$article instanceof Article) {
				throw new TypeError("ArticleList only accepts Article objects.");
			}

			$items []= $article;
			if($category === null || $article->category === $category) {
				$selected []= $article;
			}
		}

		$this->items = $items;
		$this->selected = $selected;
		$this->total = count($selected);
		$this->pageCount = max(1, (int)ceil($this->total / $pageSize));
		$this->page = max(1, min($this->pageCount, $page));
	}

	public function filter(?ArticleCategory $category):self {
		return new self($this->items, $category, $this->pageSize);
	}

	public function paginate(int $page = 1, int $pageSize = 9):self {
		return new self($this->items, $this->category, $pageSize, $page);
	}

	/** @return Traversable<int, Article> */
	public function getIterator():Traversable {
		return new ArrayIterator(array_slice($this->selected, ($this->page - 1) * $this->pageSize, $this->pageSize));
	}

	public function count():int {
		return min($this->pageSize, max(0, $this->total - ($this->page - 1) * $this->pageSize));
	}

	public function find(string $slug):?Article {
		foreach($this->selected as $article) {
			if($article->slug === $slug) {
				return $article;
			}
		}

		return null;
	}

	public function relatedTo(string $slug, int $limit = 3):self {
		if($limit < 1) {
			return new self();
		}

		$articles = array_filter($this->selected, fn(Article $article) => $article->slug !== $slug);
		return (new self($articles))->paginate(pageSize: $limit);
	}

	public function url(int $page = 1, ?ArticleCategory $category = null):string {
		$category ??= $this->category;
		$query = [];
		if($category !== null) {
			$query["category"] = $category->value;
		}
		if($page > 1) {
			$query["page"] = $page;
		}

		return "/articles/" . ($query ? "?" . http_build_query($query, encoding_type: PHP_QUERY_RFC3986) : "") . "#articles-results";
	}

	/** @return list<ArticleFilter> */
	public function filters():array {
		$filters = [new ArticleFilter("All", "/articles/#articles-results", $this->category === null ? "true" : "false", "Show all articles")];
		foreach(ArticleCategory::cases() as $category) {
			$label = $category->label();
			$selected = $this->category === $category;
			$filters []= new ArticleFilter($label, $this->url(category: $category), $selected ? "true" : "false", "Show $label articles" . ($selected ? ", selected" : ""));
		}

		return $filters;
	}

	/** @return list<ArticlePage> */
	public function pages():array {
		$numbers = range(1, $this->pageCount);
		if($this->pageCount > 5) {
			$start = max(2, min($this->page - 1, $this->pageCount - 3));
			$numbers = array_values(array_unique([1, ...range($start, $start + 2), $this->pageCount]));
			if($this->page <= 2) {
				$numbers = [1, 2, 3, $this->pageCount];
			}
		}

		return $this->pageLinks($numbers);
	}

	/** @return list<ArticlePage> */
	public function allPages():array {
		return $this->pageLinks(range(1, $this->pageCount));
	}

	/**
	 * @param list<int> $numbers
	 * @return list<ArticlePage>
	 */
	private function pageLinks(array $numbers):array {
		$links = [];
		foreach($numbers as $index => $number) {
			$position = 10 + $index;
			if($number === $this->pageCount) {
				$position = 100;
			}
			elseif($number === 1) {
				$position = 1;
			}

			$links []= new ArticlePage(
				$number,
				$this->url($number),
				$number === $this->page ? "page" : "false",
				"Page $number" . ($number === $this->page ? ", current page" : ""),
				"order:$position",
			);
		}

		return $links;
	}
}
