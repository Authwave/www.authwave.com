import {demoCorridor, generateSpacedWire, roundedPath} from "../graphics/circuit-geometry.es6";
import {CircuitTrains} from "../graphics/circuit-trains.es6";
import {CircuitShimmer} from "../graphics/circuit-shimmer.es6";

const namespace = "http://www.w3.org/2000/svg";

for(const background of document.querySelectorAll("[data-circuit-background]")) {
	const decorative = background.dataset.circuitBackground === "decorative";
	const config = JSON.parse(background.dataset.circuitConfig);
	const wires = background.querySelector(".circuit-wires");
	const connectors = background.querySelector(".circuit-connectors");
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
	const animations = new Set();
	const shapes = new WeakMap();
	const trains = new CircuitTrains(background, config);
	const shimmer = new CircuitShimmer(background, config);
	const mirrorMobile = Math.random() < .5;
	let anchorRoutes = [];
	let corridor = null;
	let constraints = null;
	let slots = [];
	let timer = 0;
	let frame = 0;
	let generation = 0;
	let visible = false;
	let lastPicked = -1;
	let firstReplacement = true;
	let size = "";
	let width = 0;
	let height = 0;

	function path(points, radius) {
		const node = document.createElementNS(namespace, "path");
		node.setAttribute("d", roundedPath(points, radius));
		node.setAttribute("pathLength", "1");
		node.setAttribute("vector-effect", "non-scaling-stroke");
		return node;
	}

	function wire(occupied = slots) {
		const routes = [...anchorRoutes, ...occupied.flatMap(group => {
			const shape = shapes.get(group);
			return [shape.points, ...shape.branches.map(branch => branch.points)];
		})];
		const shape = generateSpacedWire(width, height, config, routes, Math.random, corridor, constraints);
		if(!shape) return null;
		const group = document.createElementNS(namespace, "g");
		group.setAttribute("data-circuit-wire", "");
		group.append(path(shape.points, shape.radius));
		for(const branch of shape.branches) {
			const node = path(branch.points, shape.radius);
			node.dataset.junction = branch.junction;
			group.append(node);
		}
		shapes.set(group, shape);
		return group;
	}

	function active() {
		return config.redraw !== false && visible && !document.hidden && !reducedMotion.matches && slots.length > 0;
	}

	function schedule() {
		clearTimeout(timer);
		timer = 0;
		const delay = firstReplacement ? config.initialDelay : config.interval * (.8 + Math.random() * .4);
		if(active()) timer = setTimeout(replaceWire, delay);
	}

	function animate(group, drawing, delay = 0) {
		const duration = drawing ? config.drawDuration : config.eraseDuration;
		return Promise.all([...group.children].map(node => {
			const junction = Number(node.dataset.junction || 0);
			// Grow a fork only after the parent reaches its junction. When
			// erasing, retract it before that junction loses its parent line.
			const wait = drawing ? junction * duration : 0;
			const length = drawing ? (1 - junction) * duration : (junction || 1) * duration;
			const end = drawing ? "0" : junction ? "1" : "-1";
			const animation = node.animate([
				{strokeDashoffset: drawing ? "1" : "0"},
				{strokeDashoffset: end},
			], {duration: Math.max(1, length), delay: delay + wait, easing: "linear", fill: "both"});
			animations.add(animation);
			return animation.finished.then(() => {
				node.style.strokeDashoffset = end;
				animation.cancel();
			}, () => {}).finally(() => animations.delete(animation));
		}));
	}

	async function replaceWire() {
		timer = 0;
		if(!active()) return;
		const version = generation;
		let options = slots.map((_, i) => i).filter(i => !trains.uses(slots[i]));
		if(!options.length) {
			// Close one occupied route to new passengers, then let its current
			// passenger finish. This prevents fully occupied mobile tracks from
			// postponing line replacement indefinitely.
			if(!slots.some(group => group.hasAttribute("data-circuit-reserved"))) {
				slots[(lastPicked + 1) % slots.length].setAttribute("data-circuit-reserved", "");
			}
			schedule();
			return;
		}
		const waiting = options.filter(i => slots[i].hasAttribute("data-circuit-reserved"));
		if(waiting.length) options = waiting;
		else if(options.length > 1) options = options.filter(i => i !== lastPicked);
		const index = options[Math.floor(Math.random() * options.length)];
		lastPicked = index;
		const previous = slots[index];
		let next = wire();
		const overlap = Boolean(next);
		// If another route cannot fit alongside the old one, retract it fully
		// first. Never overlap two paths that would violate their clearance.
		if(!next) next = wire(slots.filter(group => group !== previous));
		if(!next) { schedule(); return; }
		firstReplacement = false;
		shimmer.cancelFor(previous);
		previous.setAttribute("data-circuit-changing", "");
		next.setAttribute("data-circuit-changing", "");
		for(const node of next.children) node.style.strokeDashoffset = "1";
		if(!overlap) {
			await animate(previous, false);
			if(generation !== version) return;
			previous.remove();
		}
		wires.append(next);
		slots[index] = next;
		if(!active()) {
			for(const node of next.children) node.style.strokeDashoffset = "0";
			next.removeAttribute("data-circuit-changing");
			return;
		}
		const erase = overlap ? animate(previous, false).then(() => previous.remove()) : Promise.resolve();
		const draw = animate(next, true, overlap ? config.eraseDuration * .6 : 0);
		await Promise.all([erase, draw]);
		next.removeAttribute("data-circuit-changing");
		if(generation === version) schedule();
	}

	function render() {
		frame = 0;
		const style = getComputedStyle(background);
		const stage = background.closest(".hero-placeholder");
		const preview = stage?.querySelector("login-preview");
		const demo = preview?.getBoundingClientRect();
		const aroundDemo = Number(style.getPropertyValue("--circuit-around-demo"));
		const scene = background.closest(".hero-area, .audience-area");
		const button = scene?.querySelector(".hero-action, .audience-action")?.getBoundingClientRect();
		const tagline = scene?.querySelector(".hero-tagline")?.getBoundingClientRect();
		if(button && stage) {
			// Stop halfway into the gap above the button, below the tagline.
			const top = tagline ? (tagline.bottom + button.top) / 2 : button.top;
			background.style.setProperty("--circuit-top-offset", `${Math.min(0, top - stage.getBoundingClientRect().top)}px`);
		}
		else background.style.removeProperty("--circuit-top-offset");
		const bounds = background.getBoundingClientRect();
		if(!bounds.width || !bounds.height) return;
		const relative = b => ({left: b.left - bounds.left, right: b.right - bounds.left, top: b.top - bounds.top, bottom: b.bottom - bounds.top});
		constraints = {
			button: button ? relative(button) : null,
			obstacles: [...scene.querySelectorAll(decorative
				? ".section-heading > .section-badge, .section-heading > h2, .audience-action"
				: ":scope > h1, :scope > .hero-tagline, :scope > .hero-action")].map(element => relative(element.getBoundingClientRect())),
		};
		const contentBounds = constraints.obstacles.map(b => [b.left, b.right, b.top, b.bottom].map(n => Math.round(n * 64)).join(":"));
		const nextSize = `${bounds.width}:${bounds.height}:${style.getPropertyValue("--circuit-active-density")}:${aroundDemo}:${demo ? demo.top - bounds.top : 0}:${demo?.height}:${contentBounds}`;
		if(nextSize === size) return;
		size = nextSize;
		width = bounds.width;
		height = bounds.height;
		generation++;
		shimmer.reset();
		clearTimeout(timer);
		for(const animation of animations) animation.cancel();
		animations.clear();
		wires.setAttribute("viewBox", `0 0 ${width} ${height}`);
		const count = Math.max(0, Math.round(Number(getComputedStyle(background).getPropertyValue("--circuit-active-density"))));

		// Align to the actual stroke centres of Introduction's persistent
		// gutter guides, including the clamped frame and its border thickness.
		const introduction = document.querySelector(".introduction-area");
		if(introduction) {
			const box = introduction.getBoundingClientRect();
			const guide = getComputedStyle(introduction, "::before");
			const stroke = parseFloat(guide.borderLeftWidth) / 2;
			background.style.setProperty("--circuit-left-gutter", `${box.left + parseFloat(guide.left) + stroke - bounds.left}px`);
			background.style.setProperty("--circuit-right-gutter", `${bounds.right - box.right + parseFloat(guide.right) + stroke}px`);
		}
		const anchorBox = connectors.getBoundingClientRect();
		const w = anchorBox.width;
		const r = Math.min(config.radius, width / 8, height / 8);
		const leftExit = -anchorBox.left - 2 * r;
		const rightExit = innerWidth - anchorBox.left + 2 * r;
		corridor = aroundDemo && demo ? demoCorridor(width, height, config, {
			left: demo.left - bounds.left, right: demo.right - bounds.left,
			top: demo.top - bounds.top, bottom: demo.bottom - bounds.top,
		}, anchorBox.left - bounds.left, anchorBox.right - bounds.left, button ? {
			left: button.left - bounds.left, right: button.right - bounds.left,
			top: button.top - bounds.top, bottom: button.bottom - bounds.top,
		} : null, mirrorMobile) : null;
		connectors.setAttribute("viewBox", `0 0 ${w} ${height}`);
		const leftLevel = decorative ? 2 * r : corridor ? (corridor.mirror ? corridor.lower : corridor.upper) : height * .5;
		const rightLevel = decorative ? 4 * r : corridor ? (corridor.mirror ? corridor.upper : corridor.lower) : height * .76;
		const start = decorative ? 0 : height;
		const anchors = [
			[[0, start], [0, leftLevel], [leftExit, leftLevel]],
			[[w, start], [w, rightLevel], [rightExit, rightLevel]],
		];
		connectors.replaceChildren(...anchors.map(points => path(points, r)));
		anchorRoutes = anchors.map(points => points.map(([x, y]) => [x + anchorBox.left - bounds.left, y]));
		let best = [];
		// Retry the packing rather than letting an unlucky first route use
		// all the space intended for the additional track.
		for(let attempt = 0; attempt < 8 && best.length < count; attempt++) {
			slots = [];
			for(let i = 0; i < count; i++) {
				const group = wire();
				if(!group) break;
				slots.push(group);
			}
			if(slots.length > best.length) best = slots;
		}
		slots = best;
		// Keep the first replacement clear of passengers from the outset,
		// rather than waiting for a fully occupied scene to drain a track.
		if(config.redraw !== false && firstReplacement && slots.length) slots.at(-1).setAttribute("data-circuit-reserved", "");
		wires.replaceChildren(...slots);
		trains.reset();
		schedule();
	}

	function requestRender() {
		if(!frame) frame = requestAnimationFrame(render);
	}

	function refreshActivity() {
		trains.setActive(visible && !document.hidden, reducedMotion.matches);
		shimmer.setActive(config.shimmer !== false && visible && !document.hidden && !reducedMotion.matches);
		if(!active()) for(const animation of animations) animation.finish();
		schedule();
	}

	const resize = new ResizeObserver(requestRender);
	resize.observe(background);
	const preview = background.closest(".hero-placeholder")?.querySelector("login-preview");
	if(preview) resize.observe(preview);
	const button = background.closest(".hero-area, .audience-area")?.querySelector(".hero-action, .audience-action");
	if(button) resize.observe(button);
	new IntersectionObserver(entries => {
		visible = entries[0].isIntersecting;
		refreshActivity();
	}).observe(background);
	window.addEventListener("resize", requestRender, {passive: true});
	document.addEventListener("visibilitychange", refreshActivity);
	reducedMotion.addEventListener("change", refreshActivity);
	document.fonts.ready.then(() => { if(size) trains.reset(); });
	document.fonts.ready.then(requestRender);
	requestRender();
}
