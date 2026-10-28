<?php
use Authwave\Articles\ArticleRepository;
use Authwave\Articles\ArticleView;
use Authwave\Content\ContentRepository;
use Gt\DomTemplate\Binder;

function go(Binder $binder):void {
	$binder->bindData([
		"pageTitle" => "Help with Authwave | Authwave",
		"pageDescription" => "Helpful guides for setting up Authwave, technical questions and reporting security concerns.",
		"pageContent" => (new ContentRepository())->content("help"),
	]);
	// Curated independently of publication order; change these slugs to choose guides.
	$slugs = [
		"your-first-authwave-integration",
		"understanding-email-verification",
		"make-login-your-own",
		"running-your-own-provider",
	];
	$repository = new ArticleRepository();
	$articles = [];
	foreach($slugs as $slug) {
		$article = $repository->find($slug);
		if($article) $articles []= ArticleView::data($article);
	}
	$binder->bindList($articles, templateName: "help-articles");
}
