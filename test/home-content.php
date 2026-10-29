<?php
require dirname(__DIR__) . "/vendor/autoload.php";
use Gt\Dom\HTMLDocument;
use Gt\DomTemplate\{HTMLAttributeBinder, HTMLAttributeCollection, ElementBinder, PlaceholderBinder, TableBinder, ListBinder, ListElementCollection, BindableCache, DocumentBinder};
use Authwave\Content\ContentCollection;
use Authwave\ServiceLoader;
use Gt\Config\Config;
use Gt\ServiceContainer\Container;

require dirname(__DIR__) . "/page/_common.php";
$container = new Container();
$container->addLoaderClass(new ServiceLoader(new Config(), $container));
$content = $container->get(ContentCollection::class);
if($content !== $container->get(ContentCollection::class)) {
	throw new RuntimeException("ContentCollection must be shared by the container.");
}

foreach(["hero", "introduction", "audience", "features", "contribution"] as $area) {
	$document = new HTMLDocument(file_get_contents(dirname(__DIR__) . "/page/_component/$area-area.html"));
		$htmlAttributeBinder = new HTMLAttributeBinder();
		$htmlAttributeCollection = new HTMLAttributeCollection();
		$elementBinder = new ElementBinder();
		$placeholderBinder = new PlaceholderBinder();
		$tableBinder = new TableBinder();
		$listBinder = new ListBinder();
		$listElementCollection = new ListElementCollection($document);
		$bindableCache = new BindableCache();

		$htmlAttributeBinder->setDependencies(
			$listBinder,
			$tableBinder,
		);
		$elementBinder->setDependencies(
			$htmlAttributeBinder,
			$htmlAttributeCollection,
			$placeholderBinder,
		);
		$tableBinder->setDependencies(
			$listBinder,
			$listElementCollection,
			$elementBinder,
			$htmlAttributeBinder,
			$htmlAttributeCollection,
			$placeholderBinder,
		);
		$listBinder->setDependencies(
			$elementBinder,
			$listElementCollection,
			$bindableCache,
			$tableBinder,
		);

	$binder = new DocumentBinder($document);
	$binder->setDependencies($elementBinder, $placeholderBinder, $tableBinder, $listBinder, $listElementCollection, $bindableCache);
	go($binder, $content);
	foreach($document->querySelectorAll("*") as $target) {
		if(($target->hasAttribute("data-bind:text") || $target->hasAttribute("data-bind:html")) && trim($target->textContent) === "") throw new RuntimeException("Unbound content in $area");
	}
	foreach($document->querySelectorAll("p") as $paragraph) {
		if($paragraph->querySelector("p")) throw new RuntimeException("Nested paragraph in $area");
	}
}
echo "Homepage Markdown headings and bodies bind through DomTemplate.\n";

$directory = sys_get_temp_dir() . "/authwave-content-" . bin2hex(random_bytes(8));
mkdir($directory);
try {
	file_put_contents("$directory/example.md", "# Example\n\nFirst **paragraph**.\n\nSecond paragraph.\n\n## Details\n\n- One\n- Two\n");
	$block = new Authwave\Content\ContentBlock(new Authwave\Content\ContentRepository($directory), "example");
	if($block->getFirstParagraph() !== "First <strong>paragraph</strong>.") {
		throw new RuntimeException("First paragraph must retain inline Markdown formatting.");
	}
	$body = new HTMLDocument($block->getBodyHTML());
	if($body->querySelector("h1") || $body->querySelectorAll("p")->length !== 2
		|| $body->querySelectorAll("li")->length !== 2 || !$body->querySelector("h2")) {
		throw new RuntimeException("Body HTML must retain all content after the main heading.");
	}
	if($block->getHeading() !== "Example" || $block->getFirstParagraph() !== "First <strong>paragraph</strong>.") {
		throw new RuntimeException("Reading body HTML must not change subsequent getters.");
	}
}
finally {
	unlink("$directory/example.md");
	rmdir($directory);
}
echo "Multiple paragraphs, lists and subheadings preserved in body HTML.\n";
