const GRID_SIZE = 6;
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

const main = document.querySelector("main");
main.style.setProperty("--grid-size", GRID_SIZE);

const occupiedCells = new Map();
const DIRECTIONS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const pointers = new Map();
const pixels = [];
let resetTimer;

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

	const element = document.createElement("aw-pixel");
	setPixelPosition(element, x, y);
	main.appendChild(element);
	const pixel = {element, x, y, initialX: x, initialY: y};
	pixels.push(pixel);
	occupiedCells.set(key, pixel);
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
	const bounds = main.getBoundingClientRect();
	const point = {
		x: (event.clientX - bounds.left) / bounds.width * GRID_SIZE,
		y: (event.clientY - bounds.top) / bounds.height * GRID_SIZE,
	};
	const previous = pointers.get(event.pointerId);
	const dx = previous ? point.x - previous.x : 0;
	const dy = previous ? point.y - previous.y : 0;
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
	pointers.set(event.pointerId, {...point, cell: lastCell});
}

window.addEventListener("pointermove", interact);
main.addEventListener("pointerdown", event => {
	pointers.delete(event.pointerId);
	interact(event);
});
window.addEventListener("pointerup", event => pointers.delete(event.pointerId));
window.addEventListener("pointercancel", event => pointers.delete(event.pointerId));
window.addEventListener("blur", () => pointers.clear());
