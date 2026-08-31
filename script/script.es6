const GRID_SIZE = 6;
const DIRECTIONS = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];
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
const pixels = [];
const occupiedCells = new Set();
let currentRound = [];

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

	const pixel = document.createElement("aw-pixel");
	const state = {element: pixel, x, y, moving: false};

	pixel.addEventListener("transitionend", event => {
		if(event.propertyName === "transform") {
			state.moving = false;
		}
	});
	pixel.addEventListener("transitioncancel", () => {
		state.moving = false;
	});

	setPixelPosition(pixel, x, y);
	main.appendChild(pixel);
	pixels.push(state);
	occupiedCells.add(key);
}

function movePixel(state) {
	if(state.moving) {
		return false;
	}

	const possibleMoves = [];

	for(const [deltaX, deltaY] of DIRECTIONS) {
		const x = state.x + deltaX;
		const y = state.y + deltaY;

		if(x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE &&
			!occupiedCells.has(cellKey(x, y))) {
			possibleMoves.push({x, y});
		}
	}

	if(possibleMoves.length === 0) {
		return false;
	}

	const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
	occupiedCells.delete(cellKey(state.x, state.y));
	occupiedCells.add(cellKey(move.x, move.y));
	state.x = move.x;
	state.y = move.y;
	state.moving = true;
	setPixelPosition(state.element, move.x, move.y);
	return true;
}

function shuffled(items) {
	const result = [...items];

	for(let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result;
}

function moveNextPixel() {
	if(currentRound.length === 0) {
		currentRound = shuffled(pixels);
	}

	for(let i = 0; i < currentRound.length; i++) {
		if(movePixel(currentRound[i])) {
			currentRound.splice(i, 1);
			return;
		}
	}
}

function cssTimeToMilliseconds(value) {
	const time = Number.parseFloat(value);
	return value.trim().endsWith("ms") ? time : time * 1000;
}

function startAutomaticMovement() {
	if(pixels.length === 0) {
		return;
	}

	moveNextPixel();
	const duration = getComputedStyle(pixels[0].element).transitionDuration.split(",")[0];
	const cadence = cssTimeToMilliseconds(duration) / 2;

	if(Number.isFinite(cadence) && cadence > 0) {
		setTimeout(startAutomaticMovement, cadence);
	}
}

requestAnimationFrame(() => requestAnimationFrame(startAutomaticMovement));
