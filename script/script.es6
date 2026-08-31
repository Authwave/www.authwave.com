const GRID_SIZE = 7;
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

function setPixelPosition(pixel, x, y) {
	if(!Number.isInteger(x) || !Number.isInteger(y) ||
		x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
		throw new RangeError(`Pixel coordinates must be between 0 and ${GRID_SIZE - 1}.`);
	}

	pixel.style.setProperty("--x", `${x * 100}%`);
	pixel.style.setProperty("--y", `${y * 100}%`);
}

for(const [x, y] of INITIAL_PIXELS) {
	const pixel = document.createElement("aw-pixel");
	setPixelPosition(pixel, x, y);
	main.appendChild(pixel);
}
