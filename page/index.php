<?php
namespace Authwave\Page;

use Authwave\Authenticator;
use Gt\WebEngine\Logic\Page;

class IndexPage extends Page {
	public Authenticator $auth;

	public function doLogin():void {
		if($this->auth->isLoggedIn()) {
			$this->redirect($this->auth->getAdminUri());
			exit;
		}
		else {
			$this->auth->login();
			exit;
		}
	}
}