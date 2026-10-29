// Geometry is expressed in CSS pixels after layout, so every bend uses the
// same circular radius regardless of the SVG's aspect ratio.
export function roundedPath(points, radius) {
	let d = `M ${points[0].join(" ")}`;
	for(let i = 1; i < points.length - 1; i++) {
		const [x, y] = points[i];
		const dx = Math.sign(x - points[i - 1][0]);
		const dy = Math.sign(y - points[i - 1][1]);
		const nx = Math.sign(points[i + 1][0] - x);
		const ny = Math.sign(points[i + 1][1] - y);
		const sweep = dx * ny - dy * nx > 0 ? 1 : 0;
		d += ` L ${x - dx * radius} ${y - dy * radius} A ${radius} ${radius} 0 0 ${sweep} ${x + nx * radius} ${y + ny * radius}`;
	}
	return `${d} L ${points.at(-1).join(" ")}`;
}

export function generateWire(width, height, config, random = Math.random) {
	const r = Math.min(config.radius, width / 8, height / 8);
	const between = (a, b) => a + random() * (b - a);
	const pick = list => list[Math.floor(random() * list.length)];
	const spacing = (config.spacing || 3) * r;
	const bands = Math.max(3, Math.floor((height - 2 * r) / spacing) + 1);
	const levels = Array.from({length: bands}, (_, i) => r + i * (height - 2 * r) / (bands - 1));
	const y0 = pick(levels);
	const y1 = pick(levels.filter(y => y !== y0));
	const y2 = pick(levels.filter(y => y !== y1));
	const x1 = between(2 * r, Math.max(2 * r, Math.min(width * .35, width - 6 * r)));
	const x2 = between(Math.max(x1 + 4 * r, width * .65), width - 2 * r);
	const points = [[-2 * r, y0], [x1, y0], [x1, y1], [x2, y1], [x2, y2], [width + 2 * r, y2]];
	const correction = r * (2 - Math.PI / 2);
	const lengths = points.slice(1).map((p, i) => Math.abs(p[0] - points[i][0]) + Math.abs(p[1] - points[i][1]));
	const total = lengths.reduce((a, b) => a + b, 0) - 4 * correction;
	const branches = [];
	for(const segment of [0, 2, 4]) {
		if(branches.length >= config.maxBranches || random() >= config.branchChance) continue;
		const [a, b] = [points[segment], points[segment + 1]];
		const minimum = Math.max(2 * r, a[0] + 2 * r);
		const maximum = Math.min(width - 2 * r, b[0] - 2 * r);
		if(maximum < minimum) continue;
		const x = between(minimum, maximum);
		const y = pick(levels.filter(y => y !== a[1]));
		const exit = random() < .5 ? -2 * r : width + 2 * r;
		const distance = lengths.slice(0, segment).reduce((a, b) => a + b, 0) + x - a[0] - segment * correction;
		branches.push({points: [[x, a[1]], [x, y], [exit, y]], junction: distance / total});
	}
	return {points, branches, radius: r};
}

// Only visible straight runs take up space. Trim off the circular corners and
// clip to the drawing area before comparing parallel, overlapping extents.
function straightRuns(points, radius, width, height) {
	const runs = [];
	for(let i = 1; i < points.length; i++) {
		const a = points[i - 1];
		const b = points[i];
		const horizontal = a[1] === b[1];
		const axis = horizontal ? 0 : 1;
		const direction = Math.sign(b[axis] - a[axis]);
		const start = a[axis] + (i > 1 ? radius * direction : 0);
		const end = b[axis] - (i < points.length - 1 ? radius * direction : 0);
		const position = a[1 - axis];
		const minimum = Math.max(0, Math.min(start, end));
		const maximum = Math.min(horizontal ? width : height, Math.max(start, end));
		if(position >= 0 && position <= (horizontal ? height : width) && maximum > minimum) {
			runs.push({horizontal, position, minimum, maximum});
		}
	}
	return runs;
}

export function parallelClearance(routes, occupied, radius, spacing, width, height) {
	const clear = (a, b) => a.horizontal !== b.horizontal
		|| Math.min(a.maximum, b.maximum) <= Math.max(a.minimum, b.minimum) + .001
		|| Math.abs(a.position - b.position) >= radius * spacing - .001;
	const existing = occupied.flatMap(points => straightRuns(points, radius, width, height));
	const candidate = routes.flatMap(points => straightRuns(points, radius, width, height));
	return candidate.every((a, i) => existing.every(b => clear(a, b))
		&& candidate.slice(i + 1).every(b => clear(a, b)));
}

export function demoCorridor(width, height, config, demo, leftGuide, rightGuide, button = null, mirror = false) {
	if(mirror) {
		demo = {...demo, left: width - demo.right, right: width - demo.left};
		if(button) button = {...button, left: width - button.right, right: width - button.left};
		[leftGuide, rightGuide] = [width - rightGuide, width - leftGuide];
	}
	const radius = Math.min(config.radius, width / 8, height / 8);
	const clearance = (config.spacing || 3) * radius;
	const padding = radius / 3;
	const upper = Math.max(radius / 2, Math.min(demo.top - radius - 8, demo.top / 2), button ? button.bottom + padding : 0);
	const lower = Math.min(height - radius - 2, Math.max(demo.bottom + radius + 8, (demo.bottom + height) / 2));
	return {
		mirror,
		radius,
		clearance,
		button,
		entry: button ? {
			side: "right",
			minimumX: Math.max(rightGuide, button.right + padding),
			maximumX: width - radius / 2,
			minimumY: upper + clearance,
			maximumY: lower - 2 * clearance,
		} : null,
		upper,
		lower,
		minimumX: Math.max(demo.left + radius, leftGuide + clearance),
		maximumX: Math.min(demo.right - radius, rightGuide - clearance),
	};
}

// Enter beside the CTA, descend through a free side lane and continue across
// the scene to the opposite edge. The same rule applies at every screen size.
export function generateEntryWire(width, height, config, button, random = Math.random, entry = {}) {
	const radius = Math.min(config.radius, width / 8, height / 8);
	const padding = radius / 3;
	const side = entry.side || (random() < .5 ? "left" : "right");
	const minimumX = entry.minimumX ?? (side === "left" ? radius / 2 : button.right + padding);
	const maximumX = entry.maximumX ?? (side === "left" ? button.left - padding : width - radius / 2);
	const y = button.top + (0.25 + random() * .5) * (button.bottom - button.top);
	const minimumY = Math.max(y + 2 * radius, button.bottom + padding + radius, entry.minimumY ?? 0);
	const maximumY = Math.min(height - radius - 2, entry.maximumY ?? height);
	if(maximumX < minimumX || maximumY < minimumY) return null;
	const x = minimumX + random() * (maximumX - minimumX);
	const exitY = minimumY + random() * (maximumY - minimumY);
	const left = -2 * radius, right = width + 2 * radius;
	return {points: [[side === "left" ? left : right, y], [x, y], [x, exitY], [side === "left" ? right : left, exitY]], branches: [], radius};
}

// Conservatively protect the complete rounded path: its straight segments and
// the bounding square of each circular corner must all clear the content.
export function avoidsObstacles(points, radius, obstacles) {
	const boxes = points.slice(1).map((p, i) => ({
		left: Math.min(p[0], points[i][0]), right: Math.max(p[0], points[i][0]),
		top: Math.min(p[1], points[i][1]), bottom: Math.max(p[1], points[i][1]),
	}));
	for(let i = 1; i < points.length - 1; i++) {
		const [x, y] = points[i];
		const start = [x - Math.sign(x - points[i - 1][0]) * radius, y - Math.sign(y - points[i - 1][1]) * radius];
		const end = [x + Math.sign(points[i + 1][0] - x) * radius, y + Math.sign(points[i + 1][1] - y) * radius];
		boxes.push({left: Math.min(start[0], end[0]), right: Math.max(start[0], end[0]), top: Math.min(start[1], end[1]), bottom: Math.max(start[1], end[1])});
	}
	return boxes.every(a => obstacles.every(b => a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom));
}

function generateAroundDemo(width, height, config, corridor, random, variant = 0) {
	const r = corridor.radius;
	if(variant === 2 && corridor.entry) {
		return generateEntryWire(width, height, config, corridor.button, random, corridor.entry);
	}
	if(variant > 0) {
		const minimum = Math.max(corridor.upper + corridor.clearance,
			corridor.entry ? corridor.entry.maximumY + corridor.clearance : 0);
		const maximum = corridor.lower - corridor.clearance;
		if(maximum < minimum) return null;
		const y = minimum + random() * (maximum - minimum);
		// A second mobile route crosses behind the demo. Keep its bends
		// outside the viewport rather than crowding the gutter connections.
		return {points: [[-4 * r, y - 2 * r], [-2 * r, y - 2 * r], [-2 * r, y], [width + 2 * r, y]], branches: [], radius: r};
	}
	if(corridor.maximumX < corridor.minimumX) return null;
	const x = corridor.minimumX + random() * (corridor.maximumX - corridor.minimumX);
	return {
		points: [[width + 2 * r, corridor.upper], [x, corridor.upper], [x, corridor.lower], [-2 * r, corridor.lower]],
		branches: [],
		radius: r,
	};
}

export function generateSpacedWire(width, height, config, occupied, random = Math.random, corridor = null, constraints = null) {
	const button = constraints?.button ?? corridor?.button;
	const hasEntry = button && occupied.some(points => [points[0], points.at(-1)].some(([x, y]) =>
		(x < 0 || x > width) && y >= button.top && y <= button.bottom));
	const padding = config.radius / 3;
	const obstacles = (constraints?.obstacles || []).map(b => ({left: b.left - padding, right: b.right + padding, top: b.top - padding, bottom: b.bottom + padding}));
	for(let attempt = 0; attempt < 120; attempt++) {
		const variant = occupied.length > 2 && attempt >= 60
			? (corridor?.entry && !hasEntry && attempt < 90 ? 2 : 1) : 0;
		const preferEntry = button && ((!hasEntry && attempt < 90) || random() < .35);
		const shape = corridor ? generateAroundDemo(width, height, config, corridor, random, variant)
			: preferEntry ? generateEntryWire(width, height, config, button, random) : generateWire(width, height, config, random);
		if(!shape) continue;
		if(corridor?.mirror) shape.points = shape.points.map(([x, y]) => [width - x, y]);
		if(!avoidsObstacles(shape.points, shape.radius, obstacles)) continue;
		const spacing = config.spacing || 3;
		if(!parallelClearance([shape.points], occupied, shape.radius, spacing, width, height)) continue;
		const accepted = [];
		for(const branch of shape.branches) {
			if(avoidsObstacles(branch.points, shape.radius, obstacles)
				&& parallelClearance([branch.points], [...occupied, shape.points, ...accepted.map(b => b.points)], shape.radius, spacing, width, height)) {
				accepted.push(branch);
			}
		}
		return {...shape, branches: accepted};
	}
	// Density is a ceiling: leave space rather than breaking the clearance rule.
	return null;
}
