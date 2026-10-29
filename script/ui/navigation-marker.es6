import {ShuffleBag} from "../graphics/shuffle-bag.es6";

// PHP owns selection and CSS anchors own placement. The shared marker morphs
// between its current-page square and a hovered link's highlight rectangle.
const menu = document.querySelector("#site-menu");
if(menu && CSS.supports("anchor-name", "--site-current")) {
	const marker = menu.querySelector(".site-menu-marker");
	const colours = new ShuffleBag([1, 2, 3, 4]);
	let previous;
	let movement;
	let hovered = null;
	let colouredOnClick = false;
	menu.dataset.markerReady = "";

	function colourMarker() {
		menu.style.setProperty("--theme-nav-marker-colour", `var(--theme-nav-marker-colour-${colours.next()}, var(--theme-color-heading))`);
	}

	function captureMarker() {
		const state = {rect: marker.getBoundingClientRect(), radius: getComputedStyle(marker).borderRadius};
		movement?.cancel();
		return state;
	}

	function animateMarker(from) {
		const next = marker.getBoundingClientRect();
		const style = getComputedStyle(marker);
		// CSS supplies timing and disables movement for reduced motion.
		const duration = parseFloat(style.transitionDuration) * 1000;
		if(!duration || !from?.rect.width || !next.width) return;
		const x = from.rect.x + from.rect.width / 2 - next.x - next.width / 2;
		const y = from.rect.y + from.rect.height / 2 - next.y - next.height / 2;
		movement = marker.animate([
			{transform: `translate3d(${x}px, ${y}px, 0)`, width: `${from.rect.width}px`, height: `${from.rect.height}px`, borderRadius: from.radius},
			{transform: "translate3d(0, 0, 0)", width: `${next.width}px`, height: `${next.height}px`, borderRadius: style.borderRadius},
		], {duration, easing: style.transitionTimingFunction});
	}

	function clearHover() {
		hovered?.removeAttribute("data-marker-hover");
		hovered = null;
	}

	function highlight(link) {
		if(!link || !menu.contains(link)) link = null;
		if(link === hovered) return;
		const from = captureMarker();
		clearHover();
		hovered = link;
		hovered?.setAttribute("data-marker-hover", "");
		colourMarker();
		animateMarker(from);
	}

	menu.addEventListener("pointerover", event => {
		if(event.pointerType === "mouse") highlight(event.target.closest("a"));
	});
	menu.addEventListener("pointerout", event => {
		if(event.pointerType === "mouse") highlight(event.relatedTarget?.closest?.("a"));
	});
	menu.addEventListener("focusin", event => {
		if(event.target.matches("a:focus-visible")) highlight(event.target);
	});
	menu.addEventListener("focusout", event => {
		if(event.target === hovered && !hovered.matches(":hover")) highlight(null);
	});
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
	reducedMotion.addEventListener("change", () => {
		if(reducedMotion.matches) movement?.cancel();
	});

	colourMarker();
	document.addEventListener("click", event => {
		const link = event.target.closest?.('a[data-flux~="link"]');
		if(!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
		colouredOnClick = menu.contains(link);
		if(colouredOnClick) colourMarker();
	});
	document.addEventListener("flux:before-render", event => {
		if(event.detail.updates.some(update => update.existingElement?.id === "main-content")) previous = captureMarker();
	});
	document.addEventListener("flux:after-render", event => {
		if(!event.detail.updates.some(update => update.element?.id === "main-content")) return;
		// Flux refreshes link attributes, so restore the highlight while the
		// pointer remains over the same link, including its newly selected state.
		if(hovered?.matches(":hover")) hovered.setAttribute("data-marker-hover", "");
		else clearHover();
		if(!colouredOnClick) colourMarker();
		colouredOnClick = false;
		animateMarker(previous);
		previous = null;
	});
}
