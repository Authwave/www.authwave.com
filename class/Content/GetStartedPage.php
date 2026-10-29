<?php
namespace Authwave\Content;

use Gt\Dom\HTMLDocument;

/** Adapt the shared Markdown page to the selected pricing plan. */
class GetStartedPage {
	public static function data(array $query):array {
		$data = ContentPage::data("get-started");
		$plan = $query["plan"] ?? null;
		if(!in_array($plan, ["self-hosted", "professional", "enterprise"], true)) {
			return $data;
		}

		$content = new HTMLDocument($data["pageContent"]);
		$login = $content->querySelector(".content-action");
		$login->setAttribute("href", $login->getAttribute("href") . "?" . http_build_query(["plan" => $plan]));

		if($plan === "self-hosted") {
			$hosted = $content->getElementById("hosted");
			$selfHosted = $content->getElementById("self-hosted");
			$hosted->textContent = "Alternatively, let Authwave host your login";
			// Move the whole Markdown section, leaving the introduction and help
			// section in place and keeping a single source of the actual copy.
			$node = $selfHosted;
			do {
				$next = $node->nextSibling;
				$hosted->parentNode->insertBefore($node, $hosted);
				$node = $next;
			} while($node && strtolower($node->nodeName) !== "h2");
		}

		$data["pageContent"] = $content->body->innerHTML;
		return $data;
	}
}
