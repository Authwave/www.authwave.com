import assert from "node:assert/strict";
import {build} from "esbuild";
import {fileURLToPath} from "node:url";

const result = await build({
	entryPoints: [fileURLToPath(new URL("../script/graphics/shuffle-bag.es6", import.meta.url))],
	bundle: true,
	platform: "node",
	format: "esm",
	loader: {".es6": "js"},
	write: false,
});
const {ShuffleBag} = await import("data:text/javascript;base64," + Buffer.from(result.outputFiles[0].text).toString("base64"));
let seed = 105;
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
for(const values of [
	["Vue", "React", "Svelte", "Go", "PHP", "Python", "Node.js"],
	["blue", "pink", "coral", "lime"],
	Array.from({length: 12}, (_, i) => i),
]) {
	const bag = new ShuffleBag(values, random);
	let previous;
	for(let round = 0; round < 100; round++) {
		const drawn = values.map(() => bag.next());
		assert.equal(new Set(drawn).size, values.length);
		assert.deepEqual([...drawn].sort(), [...values].sort());
		assert.notEqual(drawn[0], previous);
		previous = drawn.at(-1);
	}
}
console.log("100 shuffled rounds per name/colour/gradient bag: no omissions, within-round repeats or immediate boundary repeats.");
