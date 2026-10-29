<?php
use Authwave\Content\GetStartedPage;
use Gt\DomTemplate\Binder;
use Gt\Http\ServerRequest;

function go(Binder $binder, ServerRequest $request):void {
	$binder->bindData(GetStartedPage::data($request->getQueryParams()));
}
