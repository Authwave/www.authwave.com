import {createLogoFavicon} from "./logo-favicon.es6";

document.querySelectorAll("interactive-logo").forEach((element, index) => {
	const GRID_SIZE = 12;
	const PIXEL_SIZE = 2;
	const RESET_DELAY = 5000;
	const REWIND_STEP_DELAY = 20;
	const INITIAL_PIXELS = [
		[0.5, 2],
		[1.5, 1],
		[2.5, 2],
		[2.5, 2.5],
		[3.5, 3.5],
		[4.5, 2.5],
		[4.5, 2],
	].map(([x, y]) => [x * PIXEL_SIZE, y * PIXEL_SIZE]);

	element.style.setProperty("--grid-size", GRID_SIZE);
	element.style.setProperty("--pixel-size", PIXEL_SIZE);
	const filter = element.querySelector(".goo-filters filter");
	if(filter) {
		filter.id = `interactive-logo-gooey-${index}`;
		element.style.setProperty("--goo-filter", `url("#${filter.id}")`);
	}

	const occupiedCells = new Map();
	const DIRECTIONS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
	const pointers = new Map();
	const pixels = [];
	const movementHistory = [];
	let rewinding = false;
	let resetTimer;
	const favicon = document.createElement("link");
	favicon.rel = "icon";
	favicon.type = "image/vnd.microsoft.icon";
	favicon.sizes = "16x16 21x21 32x32 48x48";
	let faviconURL;
	let faviconRevision = 0;
	let faviconUpdatePending = false;
	const mirrors = index === 0 ? [...document.querySelectorAll("[data-logo-mirror]")] : [];
	for(const mirror of mirrors) {
		mirror.setAttribute("viewBox", `0 0 ${GRID_SIZE} ${GRID_SIZE}`);
	}

	function cellKey(x, y) {
		return `${x},${y}`;
	}

	function setPixelPosition(pixel, x, y) {
		if(!Number.isInteger(x) || !Number.isInteger(y) ||
			!inGrid(x, y) || !inGrid(x + PIXEL_SIZE - 1, y + PIXEL_SIZE - 1)) {
			throw new RangeError(`Pixel coordinates must be between 0 and ${GRID_SIZE - PIXEL_SIZE}.`);
		}

		pixel.style.setProperty("--x", `${x * 100 / PIXEL_SIZE}%`);
		pixel.style.setProperty("--y", `${y * 100 / PIXEL_SIZE}%`);
	}

	function occupyPixel(pixel) {
		for(let dx = 0; dx < PIXEL_SIZE; dx++) {
			for(let dy = 0; dy < PIXEL_SIZE; dy++) {
				const key = cellKey(pixel.x + dx, pixel.y + dy);
				if(!occupiedCells.has(key)) {
					occupiedCells.set(key, new Set());
				}
				occupiedCells.get(key).add(pixel);
			}
		}
	}

	for(const [x, y] of INITIAL_PIXELS) {
		const pixelElement = document.createElement("aw-pixel");
		setPixelPosition(pixelElement, x, y);
		element.appendChild(pixelElement);
		const pixel = {element: pixelElement, x, y, initialX: x, initialY: y};
		pixels.push(pixel);
		occupyPixel(pixel);
	}

	async function updateFavicon() {
		// Mirror the same logical layout in the header, retaining its own colour.
		for(const mirror of mirrors) {
			mirror.replaceChildren(...pixels.map(pixel => {
				const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				rect.setAttribute("x", pixel.x);
				rect.setAttribute("y", pixel.y);
				rect.setAttribute("width", PIXEL_SIZE);
				rect.setAttribute("height", PIXEL_SIZE);
				rect.setAttribute("rx", 0.12 * PIXEL_SIZE);
				return rect;
			}));
		}
		if(index !== 0) {
			return;
		}
		const revision = ++faviconRevision;
		const snapshot = pixels.map(pixel => {
			const style = getComputedStyle(pixel.element);
			const cornerRadius = style.borderTopLeftRadius;
			const radius = cornerRadius.endsWith("%")
				? Number.parseFloat(cornerRadius) / 100 * PIXEL_SIZE
				: Number.parseFloat(cornerRadius) / Number.parseFloat(style.width) * PIXEL_SIZE;
			return {x: pixel.x, y: pixel.y, colour: style.backgroundColor,
				radius: Number.isFinite(radius) ? Math.min(radius, PIXEL_SIZE / 2) : 0};
		});
		try {
			const icon = await createLogoFavicon(snapshot, GRID_SIZE, PIXEL_SIZE, filter);
			// An older asynchronous render must never replace a newer layout.
			if(revision !== faviconRevision) {
				return;
			}
			const previousURL = faviconURL;
			faviconURL = URL.createObjectURL(icon);
			favicon.href = faviconURL;
			if(previousURL) {
				URL.revokeObjectURL(previousURL);
			}
		} catch(error) {
			console.error("Unable to update the interactive favicon.", error);
		}
	}

	function scheduleFaviconUpdate() {
		if(index !== 0 || faviconUpdatePending) {
			return;
		}
		faviconUpdatePending = true;
		requestAnimationFrame(() => {
			faviconUpdatePending = false;
			updateFavicon();
		});
	}

	updateFavicon();
	if(index === 0) {
		document.head.appendChild(favicon);
		window.addEventListener("pageshow", event => {
			if(event.persisted) {
				updateFavicon();
			}
		});
		window.addEventListener("pagehide", () => {
			++faviconRevision;
			if(faviconURL) {
				URL.revokeObjectURL(faviconURL);
			}
		});
	}

	function applyPositions(positions) {
		for(const [pixel, {x, y}] of positions) {
			pixel.x = x;
			pixel.y = y;
			setPixelPosition(pixel.element, x, y);
		}
		occupiedCells.clear();
		for(const pixel of pixels) {
			occupyPixel(pixel);
		}
		scheduleFaviconUpdate();
	}

	function rewindPixels() {
		const previousPositions = movementHistory.pop();
		rewinding = Boolean(previousPositions);
		element.style.setProperty("--pixel-move-duration", rewinding ? `${REWIND_STEP_DELAY}ms` : "120ms");
		if(!previousPositions) {
			resetTimer = undefined;
			return;
		}
		// Undo the whole push together, including any neighbours it moved.
		applyPositions(previousPositions);
		// Keep the last pointer position, but allow contact with a rewound block.
		for(const pointer of pointers.values()) {
			pointer.cell = null;
		}
		resetTimer = setTimeout(rewindPixels, REWIND_STEP_DELAY);
	}

	function inGrid(x, y) {
		return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
	}

	function shuffled(items) {
		const result = [...items];
		for(let i = result.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[result[i], result[j]] = [result[j], result[i]];
		}
		return result;
	}

	function conflicts(a, b) {
		const dx = Math.abs(a.x - b.x);
		const dy = Math.abs(a.y - b.y);
		if(dx >= PIXEL_SIZE || dy >= PIXEL_SIZE) {
			return false;
		}
		// Only a one-cell squeeze along a shared row or column is allowed.
		return !((dx === 1 && dy === 0) || (dx === 0 && dy === 1));
	}

	// Plan against tentative positions, allowing aligned one-cell squeezes.
	// Each block moves at most one half-step; failed branches leave no live changes.
	function planPush(pixel, direction, moves = new Map(), visiting = new Set(), canTurn = true) {
		if(visiting.has(pixel) || moves.has(pixel)) {
			return null;
		}
		const nextVisiting = new Set(visiting).add(pixel);
		const alternatives = canTurn ? shuffled(DIRECTIONS.filter(([dx, dy]) =>
			dx !== direction[0] || dy !== direction[1],
		)) : [];
		for(const [dx, dy] of [direction, ...alternatives]) {
			const destination = {x: pixel.x + dx, y: pixel.y + dy};
			if(!inGrid(destination.x, destination.y) ||
				!inGrid(destination.x + PIXEL_SIZE - 1, destination.y + PIXEL_SIZE - 1)) {
				continue;
			}
			let branch = new Map(moves);
			branch.set(pixel, destination);
			for(const other of pixels) {
				if(other !== pixel && conflicts(destination, branch.get(other) ?? other)) {
					const position = moves.get(other) ?? other;
					const squeezedRow = pixel.y === position.y && Math.abs(pixel.x - position.x) === 1;
					const squeezedColumn = pixel.x === position.x && Math.abs(pixel.y - position.y) === 1;
					const separating = (squeezedRow && dy !== 0) || (squeezedColumn && dx !== 0);
					// A perpendicular move releases the squeeze by pushing the neighbour outward.
					const pushDirection = separating
						? squeezedRow ? [Math.sign(position.x - pixel.x), 0] : [0, Math.sign(position.y - pixel.y)]
						: [dx, dy];
					branch = planPush(other, pushDirection, branch, nextVisiting, !separating);
					if(branch === null) {
						break;
					}
				}
			}
			if(branch !== null && pixels.every(other =>
				other === pixel || !conflicts(destination, branch.get(other) ?? other),
			)) {
				return branch;
			}
		}
		return null;
	}

	function pushPixel(pixel, direction) {
		const moves = planPush(pixel, direction);
		if(!moves) {
			return;
		}
		movementHistory.push(new Map([...moves.keys()].map(pixel =>
			[pixel, {x: pixel.x, y: pixel.y}],
		)));
		// Preserve the remaining history, but give every new push a full idle
		// delay before rewinding again, including pushes during a rewind.
		rewinding = false;
		element.style.setProperty("--pixel-move-duration", "120ms");
		applyPositions(moves);
		clearTimeout(resetTimer);
		resetTimer = setTimeout(rewindPixels, RESET_DELAY);
	}

	function quantise(dx, dy) {
		return Math.abs(dx) >= Math.abs(dy)
			? [dx < 0 ? -1 : 1, 0]
			: [0, dy < 0 ? -1 : 1];
	}

	function interact(event) {
		if(!event.isPrimary) {
			return;
		}
		const bounds = element.getBoundingClientRect();
		const point = {
			x: (event.clientX - bounds.left) / bounds.width * GRID_SIZE,
			y: (event.clientY - bounds.top) / bounds.height * GRID_SIZE,
		};
		const previous = pointers.get(event.pointerId);
		const dx = previous ? (event.clientX - previous.clientX) / bounds.width * GRID_SIZE : 0;
		const dy = previous ? (event.clientY - previous.clientY) / bounds.height * GRID_SIZE : 0;
		let lastCell = previous?.cell ?? null;
		// Sample the swept path so fast swipes cannot skip over a pixel.
		const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) * 4));
		for(let i = 1; i <= steps; i++) {
			const x = point.x - dx * (1 - i / steps);
			const y = point.y - dy * (1 - i / steps);
			const cellX = Math.floor(x);
			const cellY = Math.floor(y);
			const key = inGrid(cellX, cellY) ? cellKey(cellX, cellY) : null;
			if(key !== null && key !== lastCell && occupiedCells.has(key)) {
				// A stationary tap pushes away from the contact toward the block centre.
				// Match the last-painted block when the pointer touches a shared cell.
				const pixel = [...occupiedCells.get(key)].at(-1);
				const direction = dx || dy ? quantise(dx, dy)
					: quantise(pixel.x + PIXEL_SIZE / 2 - x, pixel.y + PIXEL_SIZE / 2 - y);
				pushPixel(pixel, direction);
			}
			lastCell = key;
		}
		pointers.set(event.pointerId, {clientX: event.clientX, clientY: event.clientY, cell: lastCell});
	}

	element.addEventListener("pointermove", interact);
	element.addEventListener("pointerenter", event => {
		pointers.set(event.pointerId, {clientX: event.clientX, clientY: event.clientY, cell: null});
	});
	element.addEventListener("pointerleave", event => pointers.delete(event.pointerId));
	element.addEventListener("pointerdown", event => {
		pointers.delete(event.pointerId);
		interact(event);
	});
	window.addEventListener("pointerup", event => pointers.delete(event.pointerId));
	window.addEventListener("pointercancel", event => pointers.delete(event.pointerId));
	window.addEventListener("blur", () => pointers.clear());
});
