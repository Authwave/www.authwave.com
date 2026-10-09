const SVG_NS = "http://www.w3.org/2000/svg";
const ICON_SIZES = [16, 21, 32, 48];
const RENDER_SIZE = 256;

function canvasAt(size) {
	const canvas = document.createElement("canvas");
	canvas.width = canvas.height = size;
	return canvas;
}

function smallIcon(size, pixels, colours) {
	const canvas = canvasAt(size);
	const context = canvas.getContext("2d");
	const image = context.createImageData(size, size);
	const blockSize = size === 16 ? 4 : 5;
	const minX = Math.min(...pixels.map(pixel => pixel.x));
	const minY = Math.min(...pixels.map(pixel => pixel.y));
	const spanX = Math.max(...pixels.map(pixel => pixel.x)) - minX;
	const spanY = Math.max(...pixels.map(pixel => pixel.y)) - minY;
	// Match the ICO's 3px / 4px pitch per original grid step. Reduce the
	// pitch only when a moved layout needs more room, keeping all blocks visible.
	const pitch = Math.min(size === 16 ? 1.5 : 2, (size - blockSize) / Math.max(1, spanX, spanY));
	const offsetX = Math.floor((size - Math.round(spanX * pitch) - blockSize) / 2);
	const offsetY = Math.floor((size - Math.round(spanY * pitch) - blockSize) / 2);
	const owners = new Int16Array(size * size).fill(-1);
	pixels.forEach((pixel, owner) => {
		const left = offsetX + Math.round((pixel.x - minX) * pitch);
		const top = offsetY + Math.round((pixel.y - minY) * pitch);
		for(let y = top; y < top + blockSize; y++) {
			for(let x = left; x < left + blockSize; x++) {
				owners[y * size + x] = owner;
			}
		}
	});
	const ownerAt = (x, y) => x >= 0 && y >= 0 && x < size && y < size ? owners[y * size + x] : -1;
	const outerAlpha = size === 16 ? 179 : 128;
	const innerAlpha = size === 16 ? 77 : 128;
	for(let y = 0; y < size; y++) {
		for(let x = 0; x < size; x++) {
			let owner = ownerAt(x, y);
			let alpha = owner >= 0 ? 255 : 0;
			// Classify corners of the combined silhouette, rather than stacking
			// translucent squares. Shared edges stay opaque; inside corners stick.
			for(const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
				const horizontal = ownerAt(x + dx, y);
				const vertical = ownerAt(x, y + dy);
				if(ownerAt(x, y) >= 0 && horizontal < 0 && vertical < 0) {
					alpha = outerAlpha;
				} else if(ownerAt(x, y) < 0 && horizontal >= 0 && vertical >= 0 && ownerAt(x + dx, y + dy) >= 0) {
					alpha = Math.min(255, alpha + innerAlpha);
					owner = Math.max(owner, horizontal, vertical);
				}
			}
			if(alpha === 0) {
				continue;
			}
			const colour = colours[owner];
			const offset = (y * size + x) * 4;
			image.data.set([colour[0], colour[1], colour[2], Math.round(alpha * colour[3] / 255)], offset);
		}
	}
	context.putImageData(image, 0, 0);
	return image;
}

async function largeIconSource(pixels, gridSize, blockSize, filter) {
	const svg = document.createElementNS(SVG_NS, "svg");
	svg.setAttribute("width", RENDER_SIZE);
	svg.setAttribute("height", RENDER_SIZE);
	svg.setAttribute("viewBox", `0 0 ${gridSize} ${gridSize}`);
	const group = document.createElementNS(SVG_NS, "g");
	if(filter) {
		const defs = document.createElementNS(SVG_NS, "defs");
		const goo = filter.cloneNode(true);
		goo.id = "favicon-goo";
		// The webpage's blur is relative to the entire logo's bounding box.
		// Use grid units here so moving the blocks cannot change its strength.
		if(goo.getAttribute("primitiveUnits") === "objectBoundingBox") {
			goo.setAttribute("primitiveUnits", "userSpaceOnUse");
			for(const blur of goo.querySelectorAll("feGaussianBlur")) {
				blur.setAttribute("stdDeviation", blur.getAttribute("stdDeviation").trim().split(/\s+/).map(value => Number(value) * gridSize).join(" "));
			}
		}
		defs.appendChild(goo);
		svg.appendChild(defs);
		group.setAttribute("filter", "url(#favicon-goo)");
	}
	for(const pixel of pixels) {
		const rect = document.createElementNS(SVG_NS, "rect");
		for(const [name, value] of Object.entries({x: pixel.x, y: pixel.y, width: blockSize, height: blockSize, rx: pixel.radius, fill: pixel.colour})) {
			rect.setAttribute(name, value);
		}
		group.appendChild(rect);
	}
	svg.appendChild(group);
	const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], {type: "image/svg+xml"}));
	try {
		const image = new Image();
		await new Promise((resolve, reject) => {
			image.onload = resolve;
			image.onerror = () => reject(new Error("Unable to render the favicon's logo filter."));
			image.src = url;
		});
		const canvas = canvasAt(RENDER_SIZE);
		canvas.getContext("2d").drawImage(image, 0, 0);
		return canvas;
	} finally {
		URL.revokeObjectURL(url);
	}
}

function encodeIcon(images) {
	const headerSize = 6 + images.length * 16;
	// 32-bit DIB, followed by the ICO's padded one-bit transparency mask.
	const imageSizes = images.map(image => 40 + image.width * image.height * 4 + Math.ceil(image.width / 32) * 4 * image.height);
	const bytes = new Uint8Array(headerSize + imageSizes.reduce((sum, size) => sum + size, 0));
	const view = new DataView(bytes.buffer);
	view.setUint16(2, 1, true);
	view.setUint16(4, images.length, true);
	let offset = headerSize;
	images.forEach((image, index) => {
		const size = image.width;
		const entry = 6 + index * 16;
		bytes[entry] = bytes[entry + 1] = size;
		view.setUint16(entry + 4, 1, true);
		view.setUint16(entry + 6, 32, true);
		view.setUint32(entry + 8, imageSizes[index], true);
		view.setUint32(entry + 12, offset, true);
		view.setUint32(offset, 40, true);
		view.setInt32(offset + 4, size, true);
		view.setInt32(offset + 8, size * 2, true);
		view.setUint16(offset + 12, 1, true);
		view.setUint16(offset + 14, 32, true);
		view.setUint32(offset + 20, imageSizes[index] - 40, true);
		const maskOffset = offset + 40 + size * size * 4;
		const maskStride = Math.ceil(size / 32) * 4;
		for(let y = 0; y < size; y++) {
			for(let x = 0; x < size; x++) {
				const source = (y * size + x) * 4;
				const row = size - 1 - y;
				const target = offset + 40 + (row * size + x) * 4;
				bytes.set([image.data[source + 2], image.data[source + 1], image.data[source], image.data[source + 3]], target);
				if(image.data[source + 3] === 0) {
					bytes[maskOffset + row * maskStride + (x >> 3)] |= 0x80 >> (x & 7);
				}
			}
		}
		offset += imageSizes[index];
	});
	return new Blob([bytes], {type: "image/vnd.microsoft.icon"});
}

export async function createLogoFavicon(pixels, gridSize, blockSize, filter) {
	const colourContext = canvasAt(1).getContext("2d");
	const colours = pixels.map(pixel => {
		colourContext.clearRect(0, 0, 1, 1);
		colourContext.fillStyle = pixel.colour;
		colourContext.fillRect(0, 0, 1, 1);
		return colourContext.getImageData(0, 0, 1, 1).data;
	});
	const source = await largeIconSource(pixels, gridSize, blockSize, filter);
	const uniformColour = colours.every(colour => colour.every((channel, index) => channel === colours[0][index]));
	return encodeIcon(ICON_SIZES.map(size => {
		if(size <= 21) {
			return smallIcon(size, pixels, colours);
		}
		const context = canvasAt(size).getContext("2d");
		context.imageSmoothingEnabled = true;
		context.imageSmoothingQuality = "high";
		context.drawImage(source, 0, 0, size, size);
		const image = context.getImageData(0, 0, size, size);
		if(uniformColour) {
			// Keep the logo hue exact even at faint edges, where filtered and
			// premultiplied RGB values can acquire rounding artefacts.
			for(let offset = 0; offset < image.data.length; offset += 4) {
				image.data.set(colours[0].subarray(0, 3), offset);
			}
		}
		return image;
	}));
}
