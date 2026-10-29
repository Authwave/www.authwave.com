<?php
use Authwave\Graphics\CircuitBackground;
use Gt\DomTemplate\Binder;

function go(Binder $binder):void {
	$binder->bindData((new CircuitBackground())->view([
		"density" => 3,
		"mobileDensity" => 2,
		"trainCount" => 0,
		"mobileTrainCount" => 0,
		"transitTrainCount" => 4,
		"mobileTransitTrainCount" => 3,
		"trainSpeed" => 90,
		"transitLinear" => true,
		"transitStagger" => true,
		"requireStopAfterTransit" => false,
		"redraw" => false,
		"shimmer" => false,
	], fromTop: true));
}
