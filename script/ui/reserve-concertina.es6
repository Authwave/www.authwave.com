import {observeFluxProperties} from "./flux-properties.es6";

export function initConcertinaReserve({signal, listen, cleanup}) {
	// Reserve the tallest single-open state without toggling the real disclosures.
	// A temporary, inert sizing copy shares the original's width and style context.
	for(const concertina of document.querySelectorAll("[data-reserve-concertina]")) {
		let frame = 0;
		cleanup(() => cancelAnimationFrame(frame));

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
			if(signal.aborted) return;
			if(!frame) frame = requestAnimationFrame(measure);
		}

		// Flux observes width; reserving height must not trigger a measurement loop.
		cleanup(observeFluxProperties(concertina, ["--flux-size-x"], schedule));
		listen(window, "resize", schedule, {passive: true});
		listen(concertina, "load", schedule, true);
		document.fonts.ready.then(schedule);
		listen(document.fonts, "loadingdone", schedule);
		schedule();
	}
}
