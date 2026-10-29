<?php
use Authwave\Graphics\CircuitBackground;
use Gt\DomTemplate\Binder;

function go(Binder $binder):void {
	$binder->bindData((new CircuitBackground())->view());
}
