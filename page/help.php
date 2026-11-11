<?php
use Authwave\Articles\ArticleRepository;
use Authwave\Articles\ArticleList;
use Authwave\Content\ContentRepository;
use GT\DomTemplate\Binder;

function go(Binder $binder, ArticleRepository $repository):void {
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
	$articles = [];
	foreach($slugs as $slug) {
		$article = $repository->find($slug);
		if($article !== null) {
			array_push($articles, $article);
		}
	}

	$binder->bindList(new ArticleList($articles), templateName: "help-articles");
}
