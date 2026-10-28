<?php
use Authwave\Content\ContentPage;
use Gt\DomTemplate\Binder;

function go(Binder $binder):void {
	$binder->bindData(ContentPage::data("contribution"));
}
