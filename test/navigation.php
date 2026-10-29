<?php
require dirname(__DIR__) . "/vendor/autoload.php";
require dirname(__DIR__) . "/page/_footer.php";
require dirname(__DIR__) . "/page/_component/site-header.php";

use Gt\Dom\HTMLDocument;
use Gt\Http\Uri;

$document = new HTMLDocument(<<<HTML
<main><a id="article" href="/articles/example/">Article</a></main>
<footer>
	<a id="about" href="/about/">About</a>
	<a id="plan" href="/get-started/?plan=enterprise">Enterprise</a>
	<a id="reveal" href="/contribution/" data-flux="flux-scroll-progress flux-size">Contribution</a>
	<a id="external" href="https://github.com/Authwave/" target="_blank">GitHub</a>
	<a id="protocol-relative" href="//example.com/">External</a>
	<a id="anchor" href="#heading">Heading</a>
	<a id="pricing" href="/#pricing">Pricing</a>
	<a id="download" href="/asset/logo.svg" download>Download</a>
	<a id="new-tab" href="/help/" target="_blank">Help in new tab</a>
	<a id="email" href="mailto:contact@authwave.com">Email</a>
</footer>
HTML);
go_after($document);

$check = static function(bool $condition, string $message):void {
	if(!$condition) throw new RuntimeException($message);
};
$main = $document->querySelector("#main-content");
$check($main?->getAttribute("data-flux") === "update-link", "Every page main must be a stable Flux link-update target.");
$check($main?->getAttribute("tabindex") === "-1", "The destination main must support focus after navigation.");
foreach(["article", "about", "plan"] as $id) {
	$check($document->getElementById($id)->getAttribute("data-flux") === "link", "$id must use Flux navigation.");
}
$check($document->getElementById("reveal")->getAttribute("data-flux") === "link flux-scroll-progress flux-size", "Navigation must preserve existing Flux CSS sources.");
foreach(["external", "protocol-relative", "anchor", "pricing", "download", "new-tab", "email"] as $id) {
	$check(!$document->getElementById($id)->hasAttribute("data-flux"), "$id must retain native navigation.");
}
echo "Shared Flux link classification, update target and destination focus hooks verified.\n";

$header = new HTMLDocument(file_get_contents(dirname(__DIR__) . "/page/_component/site-header.html"));
foreach([
	"/" => ["/", "page"],
	"/about" => ["/about/", "page"],
	"/about/" => ["/about/", "page"],
	"/articles/?category=guides" => ["/articles/", "page"],
	"/articles/example/" => ["/articles/", "location"],
	"/helpful/" => [null, null],
	"/legal/" => [null, null],
] as $path => [$href, $current]) {
	go($header->body, new Uri($path));
	$selected = $header->querySelectorAll("nav a[aria-current]");
	$check(count($selected) === ($href === null ? 0 : 1), "Selection must be unique for $path, with Home matching only the root.");
	if($href !== null) {
		$check($selected[0]->getAttribute("href") === $href, "Wrong navigation prefix selected for $path.");
		$check($selected[0]->getAttribute("aria-current") === $current, "Wrong current-page/location semantics for $path.");
	}
}
$header->querySelector("nav ul")->insertAdjacentHTML("beforeend", '<li><a href="/articles/tutorials/">Tutorials</a></li>');
go($header->body, new Uri("/articles/tutorials/install/"));
$check($header->querySelector("nav a[aria-current]")?->getAttribute("href") === "/articles/tutorials/", "The longest matching navigation prefix must win.");
echo "Header selection: exact pages, nested locations, path boundaries and longest prefix verified.\n";
