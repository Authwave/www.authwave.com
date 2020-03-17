<?php
namespace Authwave\Page;

use Authwave\Authenticator;
use Gt\WebEngine\Logic\PageSetup;

class _SetupPage extends PageSetup {
	public function go():void {
		$auth = new Authenticator(
			$this->config->get("authwave.id"),
			$this->config->get("authwave.key"),
			$this->server->getRequestUri(),
			$this->config->get("authwave.host"),
			$this->session->getStore(
				"authwave.authenticator",
				true
			)
		);
		$this->logicProperty->set("auth", $auth);
	}
}