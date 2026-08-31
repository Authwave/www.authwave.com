const GRID_SIZE = 6;
const CONCURRENT_MOVEMENTS = 3;
let SHUFFLE_COUNT = 10;
const DIRECTIONS = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];
const NEIGHBOUR_DIRECTIONS = [
	[-1, -1], [0, -1], [1, -1],
	[-1, 0],           [1, 0],
	[-1, 1],  [0, 1],  [1, 1],
];
const ISOLATION_PENALTY = 6;
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
main.classList.add("is-instant");

const pixels = [];
const occupiedCells = new Set();

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
	const state = {element, x, y};
	setPixelPosition(element, x, y);
	main.appendChild(element);
	pixels.push(state);
	occupiedCells.add(key);
}

function shuffled(items) {
	const result = [...items];

	for(let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result;
}

function availableDestinations(position, occupied) {
	const destinations = [];

	for(const [deltaX, deltaY] of DIRECTIONS) {
		const x = position.x + deltaX;
		const y = position.y + deltaY;

		if(x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE &&
			!occupied.has(cellKey(x, y))) {
			destinations.push({x, y});
		}
	}

	return destinations;
}

function layoutScore(occupied) {
	let neighbourLinks = 0;
	let isolatedCells = 0;

	for(const key of occupied) {
		const [x, y] = key.split(",").map(Number);
		let neighbours = 0;

		for(const [deltaX, deltaY] of NEIGHBOUR_DIRECTIONS) {
			if(occupied.has(cellKey(x + deltaX, y + deltaY))) {
				neighbours++;
			}
		}

		neighbourLinks += neighbours;
		if(neighbours === 0) {
			isolatedCells++;
		}
	}

	return neighbourLinks / 2 - isolatedCells * ISOLATION_PENALTY;
}

function chooseDestination(from, destinations, occupied) {
	const candidates = destinations.map(to => {
		const resultingLayout = new Set(occupied);
		resultingLayout.delete(cellKey(from.x, from.y));
		resultingLayout.add(cellKey(to.x, to.y));
		return {to, score: layoutScore(resultingLayout)};
	});
	const bestScore = Math.max(...candidates.map(({score}) => score));
	const weightedCandidates = candidates.map(candidate => ({
		...candidate,
		weight: Math.exp(candidate.score - bestScore),
	}));
	const totalWeight = weightedCandidates.reduce((total, {weight}) => total + weight, 0);
	let selection = Math.random() * totalWeight;

	for(const candidate of weightedCandidates) {
		selection -= candidate.weight;
		if(selection <= 0) {
			return candidate.to;
		}
	}

	return weightedCandidates.at(-1).to;
}

function planShuffles(count) {
	const positions = new Map(
		pixels.map(state => [state, {x: state.x, y: state.y}]),
	);
	const occupied = new Set(
		[...positions.values()].map(({x, y}) => cellKey(x, y)),
	);
	const recentlyMoved = [];
	const moves = [];
	let round = [];

	while(moves.length < count) {
		if(round.length === 0) {
			round = shuffled(pixels);
		}

		let move = null;
		for(let i = 0; i < round.length; i++) {
			const state = round[i];
			if(recentlyMoved.includes(state)) {
				continue;
			}

			const from = positions.get(state);
			const destinations = availableDestinations(from, occupied);
			if(destinations.length === 0) {
				continue;
			}

			const to = chooseDestination(from, destinations, occupied);
			move = {state, from: {...from}, to};
			round.splice(i, 1);
			break;
		}

		if(!move) {
			throw new Error("Unable to plan another shuffle without colliding pixels.");
		}

		occupied.delete(cellKey(move.from.x, move.from.y));
		occupied.add(cellKey(move.to.x, move.to.y));
		positions.set(move.state, {...move.to});
		moves.push(move);
		recentlyMoved.push(move.state);

		if(recentlyMoved.length >= CONCURRENT_MOVEMENTS) {
			recentlyMoved.shift();
		}
	}

	return moves;
}

function applyMove(move, reverse = false) {
	const destination = reverse ? move.from : move.to;
	occupiedCells.delete(cellKey(move.state.x, move.state.y));
	occupiedCells.add(cellKey(destination.x, destination.y));
	move.state.x = destination.x;
	move.state.y = destination.y;
	setPixelPosition(move.state.element, destination.x, destination.y);
}

function cssTimeToMilliseconds(value) {
	const time = Number.parseFloat(value);
	return value.trim().endsWith("ms") ? time : time * 1000;
}

function movementDuration() {
	const value = getComputedStyle(pixels[0].element).transitionDuration.split(",")[0];
	return cssTimeToMilliseconds(value);
}

function wait(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function nextFrame() {
	return new Promise(resolve => requestAnimationFrame(resolve));
}

async function playMoves(moves, reverse = false) {
	const sequence = reverse ? [...moves].reverse() : moves;
	const duration = movementDuration();
	const cadence = duration / CONCURRENT_MOVEMENTS;

	for(let i = 0; i < sequence.length; i++) {
		applyMove(sequence[i], reverse);

		if(i < sequence.length - 1) {
			await wait(cadence);
		}
	}

	await wait(duration);
}

async function startAutomaticMovement() {
	if(pixels.length === 0 || SHUFFLE_COUNT <= 0) {
		return;
	}

	const initialPlan = planShuffles(SHUFFLE_COUNT);
	for(const move of initialPlan) {
		applyMove(move);
	}

	await nextFrame();
	await nextFrame();
	main.classList.remove("is-instant");
	await nextFrame();

	await playMoves(initialPlan, true);

	while(true) {
		SHUFFLE_COUNT = 10 + Math.floor(Math.random() * 10);
		const plan = planShuffles(SHUFFLE_COUNT);
		await playMoves(plan);
		await playMoves(plan, true);
	}
}

startAutomaticMovement();
