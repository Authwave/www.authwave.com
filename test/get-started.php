<?php
require __DIR__ . "/../vendor/autoload.php";

use Authwave\Content\GetStartedPage;
use Gt\Dom\HTMLDocument;

function check(bool $condition, string $message):void {
	if(!$condition) throw new RuntimeException($message);
}

$default = new HTMLDocument(GetStartedPage::data([])["pageContent"]);
foreach([null, "self-hosted", "professional", "enterprise", "invalid", ["enterprise"]] as $plan) {
	$content = new HTMLDocument(GetStartedPage::data(["plan" => $plan])["pageContent"]);
	$login = $content->querySelector(".content-action");
	$valid = in_array($plan, ["self-hosted", "professional", "enterprise"], true);
	$query = $valid ? "?plan=$plan" : "";
	check($login->getAttribute("href") === "https://login.authwave.com/admin/$query", "Only valid plan selections must carry through to login.");
	check($login->getAttribute("target") === "_self", "Login must stay in the same tab.");
	check($content->querySelectorAll("h2")->length === 3, "Each section must appear once.");
	check($content->querySelectorAll("p")->length === $default->querySelectorAll("p")->length, "Reordering must preserve all paragraphs.");
	$firstHeading = $content->querySelector("h2");
	if($plan === "self-hosted") {
		check($firstHeading->id === "self-hosted", "Self-hosting must be first when selected.");
		check($firstHeading->nextElementSibling->textContent === $default->getElementById("self-hosted")->nextElementSibling->textContent, "Self-hosting copy must move with its heading.");
		check($content->getElementById("hosted")->textContent === "Alternatively, let Authwave host your login", "Hosted heading must introduce the alternative.");
	}
	else {
		check($content->body->textContent === $default->body->textContent, "Other selections must preserve the default content order and wording.");
	}
}

$pricing = new HTMLDocument(file_get_contents(__DIR__ . "/../page/_component/pricing-area.html"));
foreach(["self-hosted", "professional", "enterprise"] as $index => $plan) {
	check($pricing->querySelectorAll(".pricing-action")[$index]->getAttribute("href") === "/get-started/?plan=$plan", "Each pricing action must carry its selection.");
}
echo "Pricing selections, login handoff and self-hosting section order verified.\n";
