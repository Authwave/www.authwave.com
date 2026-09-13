document.querySelectorAll("interactive-logo").forEach((element, index) => {
	const GRID_SIZE = 6;
	const FAVICON_COLOUR = "#164e80";
	const RESET_DELAY = 5000;
	const INITIAL_PIXELS = [
		[1, 2],
		[2, 1],
		[3, 2],
		[3, 3],
		[4, 4],
		[5, 3],
		[5, 2],
	];

	element.style.setProperty("--grid-size", GRID_SIZE);
	const filter = element.querySelector(".goo-filters filter");
	if(filter) {
		filter.id = `interactive-logo-gooey-${index}`;
		element.style.setProperty("--goo-filter", `url("#${filter.id}")`);
	}

	const occupiedCells = new Map();
	const DIRECTIONS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
	const pointers = new Map();
	const pixels = [];
	let resetTimer;
	const faviconCanvas = document.createElement("canvas");
	faviconCanvas.width = 64;
	faviconCanvas.height = 64;
	const faviconContext = faviconCanvas.getContext("2d");
	const favicon = document.createElement("link");
	favicon.rel = "icon";
	favicon.type = "image/png";
	favicon.sizes = "64x64";
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
			x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
			throw new RangeError(`Pixel coordinates must be between 0 and ${GRID_SIZE - 1}.`);
		}

		pixel.style.setProperty("--x", `${x * 100}%`);
		pixel.style.setProperty("--y", `${y * 100}%`);
	}

	for(const [x, y] of INITIAL_PIXELS) {
		const key = cellKey(x, y);
		if(occupiedCells.has(key)) {
			throw new Error(`The cell at (${x}, ${y}) is occupied by more than one pixel.`);
		}

		const pixelElement = document.createElement("aw-pixel");
		setPixelPosition(pixelElement, x, y);
		element.appendChild(pixelElement);
		const pixel = {element: pixelElement, x, y, initialX: x, initialY: y};
		pixels.push(pixel);
		occupiedCells.set(key, pixel);
	}

	function updateFavicon() {
		// Mirror the same logical layout in the header, retaining its own colour.
		for(const mirror of mirrors) {
			mirror.replaceChildren(...pixels.map(pixel => {
				const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				rect.setAttribute("x", pixel.x);
				rect.setAttribute("y", pixel.y);
				rect.setAttribute("width", 1);
				rect.setAttribute("height", 1);
				rect.setAttribute("rx", 0.12);
				return rect;
			}));
		}
		if(index !== 0 || !faviconContext) {
			return;
		}
		const size = faviconCanvas.width;
		const cellSize = size / GRID_SIZE;
		// Clearing restores transparent pixels; no page background or shadow is drawn.
		faviconContext.clearRect(0, 0, size, size);
		for(const pixel of pixels) {
			const style = getComputedStyle(pixel.element);
			const cornerRadius = style.borderTopLeftRadius;
			const radius = cornerRadius.endsWith("%")
				? Number.parseFloat(cornerRadius) / 100 * cellSize
				: Number.parseFloat(cornerRadius) / Number.parseFloat(style.width) * cellSize;
			faviconContext.fillStyle = FAVICON_COLOUR;
			faviconContext.beginPath();
			faviconContext.roundRect(
				pixel.x * cellSize, pixel.y * cellSize, cellSize, cellSize,
				Number.isFinite(radius) ? Math.min(radius, cellSize / 2) : 0,
			);
			faviconContext.fill();
		}
		favicon.href = faviconCanvas.toDataURL("image/png");
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
	}

	function resetPixels() {
		occupiedCells.clear();
		for(const pixel of pixels) {
			pixel.x = pixel.initialX;
			pixel.y = pixel.initialY;
			occupiedCells.set(cellKey(pixel.x, pixel.y), pixel);
			setPixelPosition(pixel.element, pixel.x, pixel.y);
		}
		// Keep the last pointer position, but allow contact with the restored cell.
		for(const pointer of pointers.values()) {
			pointer.cell = null;
		}
		scheduleFaviconUpdate();
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

	// Find a chain ending at a vacancy before changing any live coordinates.
	// Continue straight first; backtrack through random alternatives at a blockage.
	function planPush(x, y, direction, visited = new Set()) {
		const key = cellKey(x, y);
		if(!inGrid(x, y) || visited.has(key)) {
			return null;
		}
		if(!occupiedCells.has(key)) {
			return [];
		}
		visited.add(key);
		const alternatives = shuffled(DIRECTIONS.filter(([dx, dy]) =>
			dx !== direction[0] || dy !== direction[1],
		));

		for(const [dx, dy] of [direction, ...alternatives]) {
			const tail = planPush(x + dx, y + dy, [dx, dy], visited);
			if(tail !== null) {
				return [...tail, {pixel: occupiedCells.get(key), x: x + dx, y: y + dy}];
			}
		}
		return null;
	}

	function pushPixel(x, y, direction) {
		const moves = planPush(x, y, direction);
		if(!moves || moves.length === 0) {
			return;
		}
		// Vacancy first: every destination is free before its neighbour moves in.
		for(const {pixel, x, y} of moves) {
			occupiedCells.delete(cellKey(pixel.x, pixel.y));
			pixel.x = x;
			pixel.y = y;
			occupiedCells.set(cellKey(x, y), pixel);
			setPixelPosition(pixel.element, x, y);
		}
		clearTimeout(resetTimer);
		resetTimer = setTimeout(resetPixels, RESET_DELAY);
		scheduleFaviconUpdate();
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
				// A stationary tap pushes away from the contact toward the cell centre.
				const direction = dx || dy ? quantise(dx, dy)
					: quantise(cellX + 0.5 - x, cellY + 0.5 - y);
				pushPixel(cellX, cellY, direction);
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
