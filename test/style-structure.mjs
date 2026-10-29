import assert from "node:assert/strict";
import {readdir, readFile, access} from "node:fs/promises";

const root = new URL("../", import.meta.url);

function withoutComments(source) {
	return source.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,
		part => part.startsWith("//") || part.startsWith("/*") ? "" : part);
}

// Read source boundaries, including nested Sass blocks, without mistaking
// quoted strings, comments or #{interpolation} for selectors.
function blocks(source) {
	const found = [];
	let depth = 0, start = 0, quote = "", comment = "", interpolation = 0;
	const stack = [];
	for(let i = 0; i < source.length; i++) {
		const c = source[i], pair = source.slice(i, i + 2);
		if(comment === "line") { if(c === "\n") comment = ""; continue; }
		if(comment === "block") { if(pair === "*/") { comment = ""; i++; } continue; }
		if(quote) { if(c === "\\") i++; else if(c === quote) quote = ""; continue; }
		if(pair === "//") { comment = "line"; i++; continue; }
		if(pair === "/*") { comment = "block"; i++; continue; }
		if(c === '"' || c === "'") { quote = c; continue; }
		if(interpolation) {
			if(c === "{") interpolation++;
			if(c === "}") interpolation--;
			continue;
		}
		if(pair === "#{") { interpolation = 1; i++; continue; }
		if(c === ";") start = i + 1;
		if(c === "{") {
			const header = withoutComments(source.slice(start, i)).trim();
			const block = {header, depth, start, open: i};
			found.push(block);
			stack.push(block);
			depth++;
			start = i + 1;
		}
		if(c === "}") { depth--; stack.pop().close = i; start = i + 1; }
	}
	assert.equal(depth, 0, "Sass blocks must balance");
	return found;
}

for(const file of await readdir(new URL("style/component/", root))) {
	if(!file.endsWith(".scss")) continue;
	const name = file.slice(0, -5);
	await access(new URL(`page/_component/${name}.html`, root));
	const source = await readFile(new URL(`style/component/${file}`, root), "utf8");
	assert.deepEqual(blocks(source).filter(b => b.depth === 0).map(b => b.header), [name], `${file} must have one matching custom-tag boundary`);
	assert.ok(!/@at-root\b/.test(source), `${file} must not escape its component boundary`);
}

for(const file of await readdir(new URL("style/page/", root))) {
	if(!file.endsWith(".scss")) continue;
	const source = await readFile(new URL(`style/page/${file}`, root), "utf8");
	const selectors = blocks(source).filter(b => b.depth === 0).map(b => b.header);
	assert.ok(selectors.length > 0);
	const name = file.slice(0, -5);
	for(const selector of selectors) {
		const allowed = name === "_common" ? ["body"] : [`body.uri--${name}`, `body.dir--${name}`];
		assert.ok(allowed.includes(selector), `${file} must use its matching body/page/directory boundary`);
	}
	assert.ok(!/@at-root\b/.test(source), `${file} must not escape its page boundary`);
}

for(const [layer, prefix] of [["object", "o"], ["pattern", "p"], ["decoration", "d"]]) {
	for(const file of await readdir(new URL(`style/${layer}/`, root))) {
		if(!file.endsWith(".scss")) continue;
		const source = await readFile(new URL(`style/${layer}/${file}`, root), "utf8");
		const parsed = blocks(source);
		const placeholder = `%${prefix}-${file.slice(0, -5)}`;
		assert.deepEqual(parsed.filter(b => b.depth === 0).map(b => b.header), [placeholder], `${file} must define one matching root placeholder`);
		assert.deepEqual(parsed.filter(b => b.header.startsWith("%")).map(b => b.header), [placeholder], `${file} must nest derivatives with &, not define additional placeholders`);
		assert.ok(!/@at-root\b/.test(source), `${file} must not escape its placeholder boundary`);
		const ancestors = [];
		for(const block of parsed) {
			ancestors.length = block.depth;
			if(block.header.startsWith("%")) assert.match(block.header, new RegExp(`^%${prefix}-`), `${file} must use its layer's placeholder prefix`);
			else if(!block.header.startsWith("@")) {
				assert.ok(ancestors.some(h => h.startsWith("%") || /@(?:-\w+-)?keyframes\b/.test(h)), `${file} must expose reusable styles through placeholders`);
			}
			ancestors.push(block.header);
		}
	}
}

async function checkQueries(directory) {
	for(const entry of await readdir(directory, {withFileTypes: true})) {
		const url = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
		if(entry.isDirectory()) await checkQueries(url);
		else if(entry.name.endsWith(".scss")) {
			const source = await readFile(url, "utf8");
			const parsed = blocks(source), ancestors = [];
			for(const block of parsed) {
				ancestors.length = block.depth;
				if(/^@(media|container)\b/.test(block.header)) {
					assert.doesNotMatch(block.header, /\b(?:min|max)-(?:width|inline-size)\b|\b(?:width|inline-size)\s*(?:<|=|>=)|[<>=]\s*(?:width|inline-size)\b/, `${url.pathname} must use width > breakpoint for progressive size queries`);
					assert.ok(ancestors.some(b => !b.header.startsWith("@") || b.header.startsWith("@mixin")), `${url.pathname} responsive queries must inherit a selector scope`);
					const children = parsed.filter(b => b.depth === block.depth + 1 && b.open > block.open && b.close < block.close);
					if(children.length === 1 && !children[0].header.startsWith("@")) {
						const child = children[0];
						const outside = source.slice(block.open + 1, child.start) + source.slice(child.close + 1, block.close);
						assert.ok(withoutComments(outside).trim(), `${url.pathname}: nest ${block.header} inside ${child.header} instead of repeating the selector inside the query`);
					}
				}
				ancestors.push(block);
			}
		}
	}
}
await checkQueries(new URL("style/", root));

console.log("Component boundaries, page scopes, reusable layers and nested mobile-first range queries verified.");
