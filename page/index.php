<?php
namespace Authwave\Page;

use Gt\WebEngine\Logic\Page;

class IndexPage extends Page {
	public function doLogin():void {
		$adminUri = $this->config->get("app.admin_uri");
		$this->redirect($adminUri);
		exit;
	}
}