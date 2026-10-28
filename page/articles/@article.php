<?php
use Authwave\Articles\ArticleContent;
use Authwave\Articles\ArticleRepository;
use Authwave\Articles\ArticleView;
use Gt\Dom\HTMLDocument;
use Gt\DomTemplate\Binder;
use Gt\Http\ResponseStatusException\ClientError\HttpNotFound;
use Gt\Routing\Path\DynamicPath;

function go(Binder $binder, DynamicPath $path, HTMLDocument $document):void {
	$repository = new ArticleRepository();
	$slug = $path->get("article") ?? "";
	$article = $repository->find($slug);
	$html = $repository->content($slug);
	if(!$article || $html === null) throw new HttpNotFound("Article not found.");
	$content = new ArticleContent($html);
	$related = $repository->related($slug);
	$binder->bindData([
		"pageTitle" => $article["title"] . " | Authwave",
		"pageDescription" => $article["summary"],
		"articleBody" => $content->html,
		"hasContents" => count($content->contents) > 0,
		"hasRelated" => count($related) > 0,
	]);
	$binder->bindData(ArticleView::data($article), $document->querySelector(".article-header"));
	$binder->bindList($content->contents, templateName: "article-contents");
	$binder->bindList($related, templateName: "articles");
}
