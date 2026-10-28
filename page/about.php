<?php
use Authwave\Content\ContentRepository;
use Gt\Dom\HTMLDocument;
use Gt\DomTemplate\Binder;
use Gt\Http\ResponseStatusException\ClientError\HttpNotFound;

function go(Binder $binder):void {
	$html = (new ContentRepository())->content("about");
	if($html === null) throw new HttpNotFound("About page not found.");
	$content = new HTMLDocument($html);
	$title = trim($content->querySelector("h1")?->textContent ?? "About Authwave");
	$binder->bindData([
		"pageTitle" => "$title | Authwave",
		"pageDescription" => trim($content->querySelector("p")?->textContent ?? "Learn about Authwave."),
		"pageContent" => $html,
	]);
}
