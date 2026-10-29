<?php
namespace Authwave;

use Authwave\Content\ContentCollection;
use GT\WebEngine\Service\DefaultServiceLoader;

class ServiceLoader extends DefaultServiceLoader {
	public function loadContentCollection():ContentCollection {
		return new ContentCollection();
	}
}
