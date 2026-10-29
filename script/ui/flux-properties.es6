// Graphics need to react to measurements, rather than just style themselves.
// Flux owns measurement; this adapter forwards changed CSS outputs to the renderer.
export function observeFluxProperties(element, names, callback) {
	let previous = [];
	function refresh() {
		const values = names.map(name => element.style.getPropertyValue(name));
		if(values.every((value, index) => value === previous[index])) return;
		previous = values;
		callback(values);
	}
	const observer = new MutationObserver(refresh);
	observer.observe(element, {attributes: true, attributeFilter: ["style"]});
	refresh();
	return () => observer.disconnect();
}
