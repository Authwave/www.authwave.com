<?php
namespace Authwave\Graphics;

/** Initial, fully drawn SVG; the browser subsequently adapts it to its viewport. */
class CircuitBackground {
	public const CONFIG = [
		"density" => 4,
		"mobileDensity" => 3,
		"radius" => 36,
		"spacing" => 3,
		"branchChance" => .2,
		"maxBranches" => 1,
		"interval" => 3500,
		"initialDelay" => 1000,
		"shimmerInterval" => 1400,
		"shimmerDuration" => 1800,
		"shimmerLength" => 200,
		"eraseDuration" => 1100,
		"drawDuration" => 1900,
		"names" => ["Svelte", "React", "Vue", "Go", "PHP", "Python", "Node.js"],
		"colours" => ["blue", "pink", "coral", "lime"],
		"trainCount" => 4,
		"mobileTrainCount" => 4,
		"transitTrainCount" => 2,
		"trainSpeed" => 450,
		"stopDuration" => 3000,
		"labelFade" => 600,
		"gradientEvery" => 12,
	];

	public function view():array {
		$config = self::CONFIG;
		$radius = $config["radius"];
		$anchorRoutes = [
			[[0, 900], [0, 450], [-2400, 450]],
			[[1200, 900], [1200, 684], [3600, 684]],
		];
		$occupied = $anchorRoutes;
		$paths = "";
		$count = 0;
		for($attempt = 0; $attempt < 120 && $count < $config["density"]; $attempt++) {
			$x1 = random_int(120, 400);
			$x2 = random_int(760, 1080);
			$levels = range(2 * $radius, 900 - 2 * $radius, $config["spacing"] * $radius);
			shuffle($levels);
			$points = [[-2 * $radius, $levels[0]], [$x1, $levels[0]], [$x1, $levels[1]], [$x2, $levels[1]], [$x2, $levels[2]], [1200 + 2 * $radius, $levels[2]]];
			if(!self::clearance([$points], $occupied, $radius, $config["spacing"])) continue;
			$occupied []= $points;
			$extra = $count >= $config["mobileDensity"] ? ' data-circuit-extra' : '';
			$paths .= "<g data-circuit-wire$extra>" . self::path($points, $radius);
			if($config["maxBranches"] > 0 && random_int(0, 10000) / 10000 < $config["branchChance"]) {
				$x = (int)(($x1 + $x2) / 2);
				$branch = [[$x, $levels[1]], [$x, $levels[3]], [1200 + 2 * $radius, $levels[3]]];
				if(self::clearance([$branch], $occupied, $radius, $config["spacing"])) {
					$paths .= self::path($branch, $radius);
					$occupied []= $branch;
				}
			}
			$paths .= "</g>";
			$count++;
		}
		$anchors = implode("", array_map(fn(array $points) => self::path($points, $radius), $anchorRoutes));
		return [
			"circuitConfiguration" => json_encode($config, JSON_THROW_ON_ERROR),
			"circuitDensity" => "--circuit-mobile-density: {$config['mobileDensity']}; --circuit-desktop-density: {$config['density']}; --circuit-mobile-trains: {$config['mobileTrainCount']}; --circuit-desktop-trains: {$config['trainCount']};",
			"circuitSvg" => '<svg class="circuit-wires" viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">' . $paths . '</svg>'
				. '<svg class="circuit-connectors" viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">' . $anchors . '</svg>',
		];
	}

	/** Visible straight runs, excluding each rounded corner. */
	private static function runs(array $points, int $radius):array {
		$runs = [];
		for($i = 1; $i < count($points); $i++) {
			$a = $points[$i - 1];
			$b = $points[$i];
			$horizontal = $a[1] === $b[1];
			$axis = $horizontal ? 0 : 1;
			$direction = $b[$axis] <=> $a[$axis];
			$start = $a[$axis] + ($i > 1 ? $radius * $direction : 0);
			$end = $b[$axis] - ($i < count($points) - 1 ? $radius * $direction : 0);
			$position = $a[1 - $axis];
			$minimum = max(0, min($start, $end));
			$maximum = min($horizontal ? 1200 : 900, max($start, $end));
			if($position >= 0 && $position <= ($horizontal ? 900 : 1200) && $maximum > $minimum) {
				$runs []= [$horizontal, $position, $minimum, $maximum];
			}
		}
		return $runs;
	}

	private static function clearance(array $routes, array $occupied, int $radius, int $spacing):bool {
		$existing = [];
		foreach($occupied as $points) array_push($existing, ...self::runs($points, $radius));
		foreach($routes as $points) {
			foreach(self::runs($points, $radius) as $run) {
				foreach($existing as $other) {
					if($run[0] === $other[0] && min($run[3], $other[3]) > max($run[2], $other[2])
						&& abs($run[1] - $other[1]) < $radius * $spacing) return false;
				}
				$existing []= $run;
			}
		}
		return true;
	}

	private static function path(array $points, int $radius):string {
		[$x, $y] = $points[0];
		$d = "M $x $y";
		for($i = 1; $i < count($points) - 1; $i++) {
			[$x, $y] = $points[$i];
			$dx = $x <=> $points[$i - 1][0];
			$dy = $y <=> $points[$i - 1][1];
			$nx = $points[$i + 1][0] <=> $x;
			$ny = $points[$i + 1][1] <=> $y;
			$sweep = $dx * $ny - $dy * $nx > 0 ? 1 : 0;
			$d .= " L " . ($x - $dx * $radius) . " " . ($y - $dy * $radius)
				. " A $radius $radius 0 0 $sweep " . ($x + $nx * $radius) . " " . ($y + $ny * $radius);
		}
		[$x, $y] = $points[count($points) - 1];
		return '<path d="' . $d . " L $x $y" . '" pathLength="1" vector-effect="non-scaling-stroke" />';
	}
}
