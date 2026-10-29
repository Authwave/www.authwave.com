<?php
use Authwave\Content\ContentCollection;
use Gt\DomTemplate\Binder;

function go(Binder $binder, ContentCollection $content):void {
	$binder->bindData($content);
}
