export function initHeroMotion({signal, listen, cleanup}) {
	// Only tap recognition and the individual blur pulse are site-specific.
	// Flux supplies pointer position and scroll measurements directly to CSS.
	const hero = document.querySelector(".hero-area");

	if(hero) {
		const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
		const scene = hero.querySelector("login-preview");
		const blurPulses = new Map();
		cleanup(() => { for(const pulse of blurPulses.values()) pulse.cancel(); });
		let press = null;
		const tapSlop = 8; // CSS pixels: allow small finger jitter, not a scroll gesture.
		// The preview stays inert. Hit-test its painted panels from the hero,
		// because pointer events intentionally pass through the example controls.
		function hitPanel(event) {
			// Later notices paint above the main panel.
			return [...(scene?.querySelectorAll(".login-preview, .hero-notice") || [])].reverse().find(panel => {
				const bounds = panel.getBoundingClientRect();
				return bounds.width > 0 && bounds.height > 0
					&& event.clientX >= bounds.left && event.clientX <= bounds.right
					&& event.clientY >= bounds.top && event.clientY <= bounds.bottom;
			});
		}

		function blurPanel(panel) {
			blurPulses.get(panel)?.cancel();
			const style = getComputedStyle(panel);
			const pulse = panel.animate([
				{"--panel-click-blur": style.getPropertyValue("--panel-click-blur-strength").trim()},
				{"--panel-click-blur": "0px"},
			], {
				duration: parseFloat(style.getPropertyValue("--panel-click-blur-duration")),
				easing: "ease-out",
			});
			blurPulses.set(panel, pulse);
			const cleanup = () => {
				if(blurPulses.get(panel) === pulse) blurPulses.delete(panel);
			};
			listen(pulse, "finish", cleanup, {once: true});
			listen(pulse, "cancel", cleanup, {once: true});
		}

		listen(hero, "pointerdown", event => {
			press = null;
			if(reducedMotion.matches || !event.isPrimary || event.button !== 0) return;
			const panel = hitPanel(event);
			if(panel) press = {panel, id: event.pointerId, x: event.clientX, y: event.clientY, scrollX, scrollY};
		}, {passive: true});

		function moved(event) {
			return Math.hypot(event.clientX - press.x, event.clientY - press.y) > tapSlop;
		}

		listen(window, "pointermove", event => {
			if(press && (event.pointerId !== press.id || moved(event))) press = null;
		}, {passive: true});
		listen(window, "pointerup", event => {
			if(!press) return;
			const valid = event.pointerId === press.id && !moved(event)
				&& scrollX === press.scrollX && scrollY === press.scrollY
				&& hitPanel(event) === press.panel && !reducedMotion.matches;
			const panel = press.panel;
			press = null;
			if(valid) blurPanel(panel);
		}, {passive: true});
		listen(window, "pointercancel", () => { press = null; }, {passive: true});
		listen(window, "pointerdown", event => {
			if(!event.isPrimary) press = null;
		}, {passive: true});
		listen(window, "blur", () => { press = null; });
		listen(window, "scroll", () => {
			press = null;
		}, {passive: true});
		listen(reducedMotion, "change", () => {
			if(reducedMotion.matches) {
				press = null;
				for(const pulse of blurPulses.values()) pulse.cancel();
				blurPulses.clear();
			}
		});
	}
}
