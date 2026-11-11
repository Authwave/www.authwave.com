<?php
namespace Authwave;

use Authwave\Articles\ArticleRepository;
use Authwave\Articles\GitHubArticles;
use Authwave\Content\ContentCollection;
use GT\WebEngine\Service\DefaultServiceLoader;

class ServiceLoader extends DefaultServiceLoader {
	public function loadGitHubArticles():GitHubArticles {
		return new GitHubArticles($this->config->getString("github.token") ?? "");
	}

	public function loadArticleRepository():ArticleRepository {
		return new ArticleRepository($this->container->get(GitHubArticles::class));
	}

	public function loadContentCollection():ContentCollection {
		return new ContentCollection();
	}
}
