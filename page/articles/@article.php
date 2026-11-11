<?php
use Authwave\Articles\ArticleRepository;
use GT\DomTemplate\Binder;
use GT\Http\ResponseStatusException\ClientError\HttpNotFound;
use GT\Routing\Path\DynamicPath;

function go(
	ArticleRepository $articleRepository,
	Binder $binder,
	DynamicPath $dynamicPath,
):void {
	$slug = $dynamicPath->get("article") ?? "";
	$article = $articleRepository->find($slug);

	if($article === null) {
		throw new HttpNotFound("Article not found.");
	}

	$binder->bindData($article);

	$content = $article->content;
	$binder->bindKeyValue("pageTitle", $article->title . " | Authwave");
	$binder->bindKeyValue("pageDescription", $article->summary);

	$binder->bindList($content->contents, templateName: "article-contents");

	$related = $articleRepository->related($slug);
	$binder->bindKeyValue("relatedCount", count($related));
	$binder->bindList($related, templateName: "articles");
}
