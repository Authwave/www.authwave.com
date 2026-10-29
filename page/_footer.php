<?php
use Gt\Dom\HTMLDocument;

function go_after(HTMLDocument $document):void {
	$main = $document->querySelector("main");
	if($main) {
		$main->id = "main-content";
		$main->setAttribute("data-flux", "update-link");
		$main->setAttribute("tabindex", "-1");
	}

	foreach($document->querySelectorAll("a[href]") as $link) {
		$href = $link->getAttribute("href");
		// Fragment destinations retain native scrolling, including /#pricing.
		if(!str_starts_with($href, "/") || str_starts_with($href, "//")
			|| str_contains($href, "#") || $link->hasAttribute("download")
			|| ($link->hasAttribute("target") && $link->getAttribute("target") !== "_self")) {
			continue;
		}
		$directives = trim($link->getAttribute("data-flux") ?? "");
		$link->setAttribute("data-flux", trim("link $directives"));
	}
}
