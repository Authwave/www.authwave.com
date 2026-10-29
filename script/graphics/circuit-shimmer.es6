const namespace = "http://www.w3.org/2000/svg";

/** Short highlights follow the same geometry as complete, existing tracks. */
export class CircuitShimmer {
	constructor(background, config) {
		this.background = background;
		this.config = config;
		this.active = false;
		this.timer = 0;
		this.effects = new Map();
		this.previous = null;
	}

	setActive(active) {
		if(this.active === active) return;
		this.active = active;
		this.reset();
	}

	reset() {
		clearTimeout(this.timer);
		this.timer = 0;
		for(const effect of [...this.effects.values()]) effect.animation.cancel();
		this.previous = null;
		this.schedule();
	}

	cancelFor(group) {
		for(const [source, effect] of this.effects) {
			if(group.contains(source)) effect.animation.cancel();
		}
	}

	schedule() {
		if(this.active) this.timer = setTimeout(() => this.draw(), this.config.shimmerInterval * (.6 + Math.random() * .8));
	}

	draw() {
		this.timer = 0;
		if(!this.active) return;
		let paths = [...this.background.querySelectorAll(
			".circuit-wires > [data-circuit-wire]:not([data-circuit-changing]) > path, .circuit-connectors > path",
		)].filter(path => !this.effects.has(path));
		if(paths.length > 1) paths = paths.filter(path => path !== this.previous);
		const source = paths[Math.floor(Math.random() * paths.length)];
		if(source) {
			const length = source.getTotalLength();
			if(length > 0) this.highlight(source, length);
		}
		this.schedule();
	}

	highlight(source, length) {
		const portion = Math.min(.4, this.config.shimmerLength / length);
		// The dash travels its own length as well as the track's length.
		// Squares peak at trainSpeed (their smoothstep peak cancels the 1.5x
		// travel-time factor). Cap duration so even short tracks run at 2x that.
		const distance = length * (1 + portion);
		const duration = Math.min(this.config.shimmerDuration, 1000 * distance / (2 * this.config.trainSpeed));
		this.previous = source;
		const group = document.createElementNS(namespace, "g");
		group.classList.add("circuit-shimmer");
		const overlay = source.cloneNode(false);
		overlay.removeAttribute("style");
		overlay.style.strokeDasharray = `${portion} ${1 + portion}`;
		group.append(overlay);
		// Share the source SVG's coordinate system, including gutter offsets.
		// A group keeps the overlay out of the train route selectors.
		source.ownerSVGElement.append(group);
		const offsets = Math.random() < .5 ? [portion, -1] : [-1, portion];
		const animation = overlay.animate([
			{strokeDashoffset: offsets[0], opacity: 0},
			{opacity: .65, offset: .15},
			{opacity: .65, offset: .8},
			{strokeDashoffset: offsets[1], opacity: 0},
		], {duration, easing: "linear"});
		this.effects.set(source, {animation, group});
		const remove = () => {
			group.remove();
			this.effects.delete(source);
		};
		animation.finished.then(remove, remove);
	}
}
