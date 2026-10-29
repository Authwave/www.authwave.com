import {ShuffleBag} from "./shuffle-bag.es6";

const smooth = t => t * t * (3 - 2 * t);
const intersects = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

export function preferEmptyTracks(paths, cars) {
	const occupancy = new Map();
	for(const car of cars) occupancy.set(car.path, (occupancy.get(car.path) || 0) + 1);
	// Stable sorting preserves the shuffled order within each occupancy tier.
	return [...paths].sort((a, b) => (occupancy.get(a) || 0) - (occupancy.get(b) || 0));
}

/** Decorative passengers travel only on complete tracks, parking clear of UI. */
export class CircuitTrains {
	constructor(background, config) {
		this.background = background;
		this.config = config;
		this.names = new ShuffleBag(config.names);
		this.directions = new ShuffleBag([1, -1]);
		this.colours = new ShuffleBag(config.colours);
		this.gradientColours = new ShuffleBag(config.colours);
		this.pendingAppearance = null;
		this.pendingTransitAppearance = null;
		this.gradients = new ShuffleBag(Array.from({length: config.gradientEvery}, (_, i) => i));
		this.layer = document.createElement("div");
		this.layer.className = "circuit-trains";
		background.append(this.layer);
		this.cars = [];
		this.frame = 0;
		this.lastTime = 0;
		this.clock = 0;
		this.active = false;
		this.reduced = false;
		this.retryAt = 0;
		this.count = 0;
		this.transitCount = 0;
		this.parkedStarts = 0;
		// Record successful entries, rather than departures. A following square
		// must stop even while its non-stopping predecessor is still travelling.
		this.requiresStop = new WeakSet();
	}

	uses(group) {
		return this.cars.some(car => car.path.closest("[data-circuit-wire]") === group);
	}

	reset() {
		cancelAnimationFrame(this.frame);
		this.frame = 0;
		this.lastTime = 0;
		this.cars = [];
		this.layer.replaceChildren();
		this.routeBag = null;
		this.transitRouteBag = null;
		this.retryAt = 0;
		this.count = Number(getComputedStyle(this.background).getPropertyValue("--circuit-active-trains"));
		this.transitCount = Number(getComputedStyle(this.background).getPropertyValue("--circuit-active-transit-trains"));
		this.parkedStarts = Math.min(2, this.count);
		this.initializing = true;
		this.populate();
		this.initializing = false;
		this.setActive(this.active, this.reduced);
	}

	setActive(active, reduced) {
		this.active = active;
		this.reduced = reduced;
		if(!active || reduced) {
			cancelAnimationFrame(this.frame);
			this.frame = 0;
			this.lastTime = 0;
			if(reduced) for(const car of this.cars) {
				car.age = car.transit ? car.arrive / 2 : car.arrive + this.config.labelFade;
				this.paint(car, car.stop, car.transit ? 0 : 1);
			}
		}
		else if(!this.frame) this.frame = requestAnimationFrame(time => this.tick(time));
	}

	tracks() {
		return [...this.background.querySelectorAll(".circuit-wires > [data-circuit-wire]:not([data-circuit-changing]):not([data-circuit-reserved]) > path:first-child, .circuit-connectors > path")];
	}

	spawn(transit = false) {
		const paths = this.tracks().filter(path => !transit
			|| !this.config.requireStopAfterTransit || !this.requiresStop.has(path));
		if(!paths.length) return;
		const bagKey = transit ? "transitRouteBag" : "routeBag";
		const routesKey = transit ? "transitRoutes" : "routes";
		const pendingKey = transit ? "pendingTransitAppearance" : "pendingAppearance";
		if(!this[bagKey] || paths.length !== this[routesKey].length || paths.some((p, i) => p !== this[routesKey][i])) {
			this[routesKey] = paths;
			this[bagKey] = new ShuffleBag(paths);
		}
		const shuffled = [];
		while(shuffled.length < paths.length) {
			const path = this[bagKey].next();
			if(!shuffled.includes(path)) shuffled.push(path);
		}
		if(!transit && this.config.requireStopAfterTransit) {
			// Within the same occupancy tier, favour routes waiting for a stop.
			shuffled.sort((a, b) => Number(this.requiresStop.has(b)) - Number(this.requiresStop.has(a)));
		}
		const candidates = preferEmptyTracks(shuffled, this.cars);
		const node = document.createElement("div");
		node.className = "circuit-train";
		if(!this[pendingKey]) {
			const colour = this.colours.next();
			const appearance = {name: transit ? "" : this.names.next(), colour, direction: this.directions.next(), gradient: this.gradients.next() === 0};
			if(appearance.gradient) {
				do { appearance.secondary = this.gradientColours.next(); }
				while(appearance.secondary === colour && this.config.colours.length > 1);
			}
			this[pendingKey] = appearance;
		}
		const appearance = this[pendingKey];
		if(transit) node.setAttribute("data-in-transit", "");
		node.dataset.name = appearance.name;
		node.dataset.colour = appearance.colour;
		node.dataset.direction = appearance.direction === 1 ? "forward" : "reverse";
		node.style.setProperty("--train-colour", `var(--circuit-colour-${appearance.colour}, currentColor)`);
		const square = document.createElement("span");
		square.className = "circuit-train-square";
		if(appearance.gradient) {
			node.dataset.gradient = "";
			node.style.setProperty("--train-gradient-colour", `var(--circuit-colour-${appearance.secondary}, currentColor)`);
		}
		const label = document.createElement("span");
		label.className = "circuit-train-label";
		label.textContent = node.dataset.name;
		node.append(square, label);
		this.layer.append(node);
		const bounds = this.background.getBoundingClientRect();
		const labelBox = label.getBoundingClientRect();
		const size = square.getBoundingClientRect().width;
		const obstacles = transit ? [] : [...document.querySelectorAll(".hero-area .login-preview, .hero-area .hero-notice, .hero-area .hero-action")].flatMap(panel => {
			const central = panel.classList.contains("login-preview");
			// The wrapper gives the central panel's final, untransformed bounds.
			const r = (central ? panel.parentElement : panel).getBoundingClientRect();
			if(!r.width || !r.height) return [];
			// Include the remaining entrance growth and independent pointer/orbit motion.
			const padding = central ? 16 : panel.classList.contains("hero-action") ? 12 : 24 + Math.max(r.width, r.height) * .06;
			return [{left: r.left - bounds.left - padding, right: r.right - bounds.left + padding, top: r.top - bounds.top - padding, bottom: r.bottom - bounds.top + padding}];
		});
		for(const path of candidates) {
			const matrix = path.getScreenCTM();
			if(!matrix) continue;
			const length = path.getTotalLength();
			const point = distance => {
				const position = appearance.direction === 1 ? distance : length - distance;
				const p = path.getPointAtLength(position).matrixTransform(matrix);
				return {x: p.x - bounds.left, y: p.y - bounds.top};
			};
			const travelTime = distance => 1500 * Math.max(2 * this.config.radius, distance) / this.config.trainSpeed;
			if(transit) {
				const arrive = this.config.transitLinear ? 1000 * length / this.config.trainSpeed : travelTime(length);
				const age = this.initializing && this.config.transitStagger ? Math.random() * arrive : 0;
				const car = {node, label, path, point, length, stop: length / 2, age, arrive, transit: true};
				this.cars.push(car);
				if(this.config.requireStopAfterTransit) this.requiresStop.add(path);
				this[pendingKey] = null;
				const progress = age / arrive;
				this.paint(car, this.reduced ? car.stop : length * (this.config.transitLinear ? progress : smooth(progress)), 0);
				return car;
			}
			const stops = new ShuffleBag(Array.from({length: 37}, (_, i) => .05 + i * .025));
			for(let i = 0; i < 37; i++) {
				const stop = length * stops.next();
				const p = point(stop);
				const marker = {left: p.x - size, right: p.x + size, top: p.y - size, bottom: p.y + size};
				const inside = r => r.left >= 8 && r.right <= bounds.width - 8 && r.top >= 8 && r.bottom <= bounds.height - 8;
				if(!inside(marker) || obstacles.some(r => intersects(r, marker))) continue;
				const left = Math.max(8 - p.x, Math.min(-labelBox.width / 2, bounds.width - 8 - p.x - labelBox.width));
				const placements = [
					{x: left, y: size / 2 + 8},
					{x: left, y: -size / 2 - 8 - labelBox.height},
					{x: size / 2 + 8, y: -labelBox.height / 2},
					{x: -size / 2 - 8 - labelBox.width, y: -labelBox.height / 2},
				];
				for(const offset of placements) {
					const parkedLabel = {left: p.x + offset.x, right: p.x + offset.x + labelBox.width, top: p.y + offset.y, bottom: p.y + offset.y + labelBox.height};
					if(!inside(parkedLabel) || obstacles.some(r => intersects(r, parkedLabel))) continue;
					if(this.cars.some(car => car.parking && (intersects(car.parking, parkedLabel) || intersects(car.parking, marker)))) continue;
					label.style.left = `${offset.x}px`;
					label.style.top = `${offset.y}px`;
					const parking = {left: Math.min(marker.left, parkedLabel.left) - 12, right: Math.max(marker.right, parkedLabel.right) + 12, top: Math.min(marker.top, parkedLabel.top) - 12, bottom: Math.max(marker.bottom, parkedLabel.bottom) + 12};
					const car = {node, label, path, point, length, stop, parking, age: 0, arrive: travelTime(stop), depart: travelTime(length - stop)};
					this.cars.push(car);
					this.requiresStop.delete(path);
					this.pendingAppearance = null;
					const parked = this.reduced || this.parkedStarts > 0;
					if(parked) car.age = car.arrive + this.config.labelFade;
					if(this.parkedStarts > 0) this.parkedStarts--;
					this.paint(car, parked ? stop : 0, parked ? 1 : 0);
					return car;
				}
			}
		}
		node.remove();
	}

	populate() {
		while(this.cars.filter(car => !car.transit).length < this.count) {
			if(!this.spawn()) break;
		}
		while(this.cars.filter(car => car.transit).length < this.transitCount) {
			if(!this.spawn(true)) break;
		}
	}

	paint(car, distance, opacity) {
		const p = car.point(distance);
		car.node.style.transform = `translate3d(${p.x.toFixed(3)}px, ${p.y.toFixed(3)}px, 0)`;
		car.label.style.opacity = opacity;
	}

	tick(time) {
		this.frame = 0;
		if(!this.active || this.reduced) return;
		const delta = this.lastTime ? Math.min(64, time - this.lastTime) : 0;
		this.lastTime = time;
		this.clock += delta;
		const fade = this.config.labelFade;
		for(const car of [...this.cars]) {
			car.age += delta;
			if(car.transit) {
				if(car.age >= car.arrive) {
					car.node.remove();
					this.cars.splice(this.cars.indexOf(car), 1);
				}
				else this.paint(car, car.length * (this.config.transitLinear ? car.age / car.arrive : smooth(car.age / car.arrive)), 0);
				continue;
			}
			const departure = car.arrive + 2 * fade + this.config.stopDuration;
			if(car.age >= departure + car.depart) {
				car.node.remove();
				this.cars.splice(this.cars.indexOf(car), 1);
				continue;
			}
			let distance = car.stop;
			let opacity = 0;
			if(car.age < car.arrive) distance *= smooth(car.age / car.arrive);
			else if(car.age < car.arrive + fade) opacity = smooth((car.age - car.arrive) / fade);
			else if(car.age < departure - fade) opacity = 1;
			else if(car.age < departure) opacity = 1 - smooth((car.age - departure + fade) / fade);
			else distance += (car.length - car.stop) * smooth((car.age - departure) / car.depart);
			this.paint(car, distance, opacity);
		}
		if(this.cars.filter(car => car.transit).length < this.transitCount
			|| (this.clock >= this.retryAt && this.cars.filter(car => !car.transit).length < this.count)) {
			this.populate();
			this.retryAt = this.clock + 2000;
		}
		this.frame = requestAnimationFrame(next => this.tick(next));
	}
}
