<?php
use Gt\Dom\Element;
use Gt\Http\Uri;

function go(Element $element, Uri $uri):void {
	$path = rtrim($uri->getPath(), "/") ?: "/";
	$selected = null;
	$selectedPath = "";
	foreach($element->querySelectorAll("nav a[href]") as $link) {
		$link->removeAttribute("aria-current");
		$href = $link->getAttribute("href");
		if(!str_starts_with($href, "/") || str_starts_with($href, "//")) continue;
		$linkPath = rtrim((new Uri($href))->getPath(), "/") ?: "/";
		// Home is exact-only; other links also cover their child pages.
		$matches = $path === $linkPath || ($linkPath !== "/" && str_starts_with($path, "$linkPath/"));
		if($matches && strlen($linkPath) > strlen($selectedPath)) {
			$selected = $link;
			$selectedPath = $linkPath;
		}
	}
	$selected?->setAttribute("aria-current", $path === $selectedPath ? "page" : "location");
}
