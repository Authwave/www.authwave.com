// Flux's local CSS-variable bridge: viewport position drives the reveal,
// rather than starting a timed animation when an observer threshold is crossed.
const elements = [...document.querySelectorAll("[data-scroll-reveal]")];

if(elements.length) {
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
	let frame = 0;

	function update() {
		frame = 0;
		// Read every element before writing styles, keeping layout work together.
		const progress = elements.map(element => {
			if(reducedMotion.matches) return 1;
			const bounds = element.getBoundingClientRect();
			// Clear once the whole element is in view; for an element taller than
			// the viewport, clear when its top reaches the top of the viewport.
			const distance = Math.max(1, Math.min(bounds.height, innerHeight));
			return Math.min(1, Math.max(0, (innerHeight - bounds.top) / distance));
		});
		elements.forEach((element, index) => element.style.setProperty("--scroll-reveal", progress[index].toFixed(4)));
	}

	function schedule() {
		if(!frame) frame = requestAnimationFrame(update);
	}

	window.addEventListener("scroll", schedule, {passive: true});
	window.addEventListener("resize", schedule, {passive: true});
	window.addEventListener("pageshow", schedule);
	reducedMotion.addEventListener("change", schedule);
	document.fonts.ready.then(schedule);
	// Also recalculate when content above the elements changes the page layout.
	new ResizeObserver(schedule).observe(document.body);
	schedule();
}
