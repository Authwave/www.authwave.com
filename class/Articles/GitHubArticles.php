<?php
namespace Authwave\Articles;

use Closure;
use GT\FileCache\Cache;
use GT\FileCache\FileAccess;
use GT\FileCache\FileNotFoundException;
use RuntimeException;
use Symfony\Component\Yaml\Yaml;

/** Fetch only the Articles discussion category; retain the last successful snapshot. */
readonly class GitHubArticles {
	private const CATEGORIES = [
		"www:guide" => "guides",
		"www:tutorial" => "tutorials",
		"www:product" => "product",
		"www:engineering" => "engineering",
	];
	private Closure $request;

	public function __construct(
		private string $token,
		private string $directory = __DIR__ . "/../../data/cache/articles",
		?callable $request = null,
		private int $secondsValid = 3600,
	) {
		$this->request = $request === null ? $this->request(...) : Closure::fromCallable($request);
	}

	/** @return array<string, string> Dated filenames mapped to Markdown with front matter. */
	public function all():array {
		$access = new FileAccess("$this->directory/index");
		$cache = new Cache(secondsValid: $this->secondsValid, fileAccess: $access);

		try {
			$documents = $cache->getArray("articles", fn() => $this->fetch());
		}
		catch(RuntimeException $exception) {
			try {
				$documents = $access->getData("articles");
			}
			catch(FileNotFoundException) {
				throw $exception;
			}
		}

		$markdownCache = new Cache(secondsValid: $this->secondsValid, fileAccess: new MarkdownFileAccess($this->directory));

		foreach($documents as $name => $markdown) {
			// Include a content hash so an edited discussion can never reuse an older body.
			$key = pathinfo($name, PATHINFO_FILENAME) . "-" . hash("sha256", $markdown) . ".md";
			$documents[$name] = $markdownCache->getString($key, fn() => $markdown);
		}

		return $documents;
	}

	private function fetch():array {
		$documents = [];
		$slugs = [];
		$cursor = null;
		do {
			$query = <<<'GRAPHQL'
query($cursor: String) {
  repository(owner: "Authwave", name: "www.authwave.com") {
    discussions(first: 100, after: $cursor, categoryId: "DIC_kwDODLwVZ84DKUzZ") {
      nodes { title body createdAt labels(first: 100) { nodes { name } } }
      pageInfo { hasNextPage endCursor }
    }
  }
}

GRAPHQL;
			$data = ($this->request)($query, ["cursor" => $cursor]);
			$connection = $data["data"]["repository"]["discussions"] ?? null;

			if(!empty($data["errors"]) || !is_array($connection)
				|| !isset($connection["nodes"], $connection["pageInfo"]["hasNextPage"])) {
				throw new RuntimeException("GitHub returned an invalid article response.");
			}

			foreach($connection["nodes"] as $discussion) {
				$categories = [];

				foreach($discussion["labels"]["nodes"] as $label) {
					if(isset(self::CATEGORIES[$label["name"]])) {
						$categories []= self::CATEGORIES[$label["name"]];
					}
				}

				if(count($categories) !== 1) {
					throw new RuntimeException("Each article discussion needs exactly one www: category label.");
				}

				$title = trim($discussion["title"]);
				// A subtitle after a colon does not become part of the public URL.
				$slug = trim(preg_replace('/[^a-z0-9]+/', "-", strtolower(explode(":", $title, 2)[0])), "-");

				if($slug === "" || isset($slugs[$slug])) {
					throw new RuntimeException("Article discussion slugs must be non-empty and unique.");
				}

				$slugs[$slug] = true;
				$body = str_replace("\r\n", "\n", trim($discussion["body"]));

				if($body === "") {
					throw new RuntimeException("Article discussion body is empty.");
				}

				$summary = "";

				foreach(preg_split('/\n\s*\n/', $body) as $paragraph) {
					if(preg_match('/^[#<>`|\-]/', $paragraph)) {
						continue;
					}

					$summary = trim(preg_replace('/\s+/', " ", strip_tags($paragraph)));
					break;
				}

				if($summary === "") {
					$summary = $title;
				}

				$published = substr($discussion["createdAt"], 0, 10);
				$documents["$published-$slug.md"] = "---\n" . Yaml::dump([
					"title" => $title,
					"category" => $categories[0],
					"summary" => $summary,
					"cover" => $this->coverFromLabels($discussion["labels"]["nodes"]),
				]) . "---\n\n$body\n";
			}

			$next = $connection["pageInfo"]["hasNextPage"];
			$after = $connection["pageInfo"]["endCursor"] ?? null;

			if($next && (!is_string($after) || $after === $cursor)) {
				throw new RuntimeException("Invalid GitHub pagination cursor.");
			}

			$cursor = $after;
		} while($next);

		return $documents;
	}

	/** @param list<array{name: string}> $labels GitHub API label records. */
	private function coverFromLabels(array $labels):string {
		$cover = null;
		foreach($labels as $label) {
			$name = $label["name"];
			if(!str_starts_with($name, "www:label:")) {
				continue;
			}

			if($cover !== null) {
				throw new RuntimeException("An article discussion can have at most one www:label: illustration label.");
			}

			$image = substr($name, strlen("www:label:"));
			if(!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D', $image)
				|| !is_file(__DIR__ . "/../../asset/illustration/articles/$image.svg")) {
				throw new RuntimeException("Unknown article illustration label: $name");
			}

			$cover = "$image.svg";
		}

		return $cover ?? "web-screen.svg";
	}

	private function request(string $query, array $variables):array {
		if(trim($this->token) === "") {
			throw new RuntimeException("Set github.token in WebEngine configuration to load article discussions.");
		}

		$curl = curl_init("https://api.github.com/graphql");
		curl_setopt_array($curl, [
			CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true,
			CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_TIMEOUT => 20,
			CURLOPT_HTTPHEADER => ["Authorization: Bearer $this->token", "User-Agent: Authwave-Articles", "Content-Type: application/json"],
			CURLOPT_POSTFIELDS => json_encode(["query" => $query, "variables" => $variables], JSON_THROW_ON_ERROR),
		]);
		$response = curl_exec($curl);
		$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);

		if($response === false || $status !== 200) {
			throw new RuntimeException("Unable to fetch GitHub articles (HTTP $status).");
		}

		try {
			$data = json_decode($response, true, flags: JSON_THROW_ON_ERROR);
		}
		catch(\JsonException $exception) {
			throw new RuntimeException("Invalid GitHub JSON response.", previous: $exception);
		}

		if(!is_array($data)) {
			throw new RuntimeException("Invalid GitHub JSON response.");
		}

		return $data;
	}
}
