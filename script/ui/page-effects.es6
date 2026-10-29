import {initHeroMotion} from "./hero-motion.es6";
import {initConcertinaReserve} from "./reserve-concertina.es6";
import {initShowcaseHover} from "./showcase-hover.es6";
import {initCircuitBackground} from "./circuit-background.es6";

// Flux replaces main while the header, footer, theme control and logo persist.
// Restart only page-owned effects, and dispose their observers/listeners/timers.
let main;
let dispose = () => {};

function initialise() {
	const next = document.querySelector("#main-content");
	if(next === main) return;
	const navigating = Boolean(main);
	dispose();
	main = next;
	if(!main) return;

	const controller = new AbortController();
	const {signal} = controller;
	const callbacks = [];
	const context = {
		signal,
		cleanup: callback => callbacks.push(callback),
		listen(target, type, listener, options = {}) {
			// These listeners belong to this page lifecycle. Register natively
			// so Flux does not copy stale closures onto the next page's nodes.
			EventTarget.prototype.addEventListener.call(target, type, event => {
				if(!signal.aborted) listener(event);
			}, {...options, signal});
		},
	};
	dispose = () => {
		controller.abort();
		for(const callback of callbacks) callback();
	};
	for(const init of [initHeroMotion, initConcertinaReserve, initShowcaseHover, initCircuitBackground]) {
		init(context);
	}
	if(navigating) {
		for(const popover of document.querySelectorAll(":popover-open")) popover.hidePopover();
		main.focus({preventScroll: true});
	}
}

initialise();
document.addEventListener("flux:before-render", event => {
	const update = event.detail.updates.find(update => update.existingElement === main);
	if(update) {
		update.newElement?.setAttribute("data-view-fade", "");
		dispose();
		dispose = () => {};
	}
});
document.addEventListener("flux:after-render", initialise);
