// Reserve the tallest single-open state without toggling the real disclosures.
// A temporary, inert sizing copy shares the original's width and style context.
for(const concertina of document.querySelectorAll("[data-reserve-concertina]")) {
	let frame = 0;
	let width = 0;

	function measure() {
		frame = 0;
		if(!concertina.isConnected || !concertina.getBoundingClientRect().width) return;
		const probe = concertina.cloneNode(true);
		probe.removeAttribute("data-reserve-concertina");
		probe.setAttribute("data-concertina-measure", "");
		probe.setAttribute("aria-hidden", "true");
		probe.inert = true;
		Object.assign(probe.style, {
			position: "absolute",
			visibility: "hidden",
			pointerEvents: "none",
			boxSizing: "border-box",
			inlineSize: `${concertina.getBoundingClientRect().width}px`,
			minBlockSize: "0",
			blockSize: "auto",
		});
		for(const element of [probe, ...probe.querySelectorAll("[id]")]) element.removeAttribute("id");
		const items = [...probe.querySelectorAll(":scope > details")];
		for(const item of items) {
			item.removeAttribute("name");
			item.open = false;
		}
		concertina.after(probe);
		try {
			const closedHeight = probe.getBoundingClientRect().height;
			const closedItems = items.map(item => item.getBoundingClientRect().height);
			for(const item of items) item.open = true;
			const largestExpansion = Math.max(0, ...items.map((item, index) => item.getBoundingClientRect().height - closedItems[index]));
			concertina.style.setProperty("--concertina-reserved-height", `${Math.ceil(closedHeight + largestExpansion)}px`);
		}
		finally {
			probe.remove();
		}
	}

	function schedule() {
		if(!frame) frame = requestAnimationFrame(measure);
	}

	// Observe width only: reserving height must not trigger a measurement loop.
	new ResizeObserver(entries => {
		const nextWidth = entries[0].contentRect.width;
		if(nextWidth === width) return;
		width = nextWidth;
		schedule();
	}).observe(concertina);
	window.addEventListener("resize", schedule, {passive: true});
	concertina.addEventListener("load", schedule, true);
	document.fonts.ready.then(schedule);
	document.fonts.addEventListener("loadingdone", schedule);
	schedule();
}
