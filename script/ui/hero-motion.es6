// Flux currently has no pointer/scroll CSS-variable directive. Keep this small
// bridge local; CSS owns the distances, smoothing, breakpoint and visual effect.
const hero = document.querySelector(".hero-area");

if(hero) {
	const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
	const scene = hero.querySelector("login-preview");
	const blurPulses = new Map();
	let frame = 0;
	let pointerX = 0;
	let pointerY = 0;
	const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

	function update() {
		frame = 0;
		const bounds = hero.getBoundingClientRect();
		const progress = reducedMotion.matches ? 0 : clamp(-bounds.top / bounds.height, 0, 1);
		const visible = bounds.bottom > 0 && bounds.top < innerHeight;
		hero.style.setProperty("--hero-pointer-x", reducedMotion.matches || !visible ? 0 : pointerX);
		hero.style.setProperty("--hero-pointer-y", reducedMotion.matches || !visible ? 0 : pointerY);
		hero.style.setProperty("--hero-exit-progress", progress.toFixed(4));
	}

	function schedule() {
		if(!frame) frame = requestAnimationFrame(update);
	}

	hero.addEventListener("pointermove", event => {
		if(event.pointerType !== "mouse" || reducedMotion.matches) return;
		pointerX = clamp(event.clientX / innerWidth * 2 - 1, -1, 1);
		pointerY = clamp(event.clientY / innerHeight * 2 - 1, -1, 1);
		schedule();
	}, {passive: true});
	hero.addEventListener("pointerleave", () => {
		pointerX = pointerY = 0;
		schedule();
	}, {passive: true});
	// The preview stays inert. Hit-test its painted panels from the hero,
	// because pointer events intentionally pass through the example controls.
	hero.addEventListener("pointerdown", event => {
		if(!scene || reducedMotion.matches || (event.pointerType === "mouse" && event.button !== 0)) return;
		// Later notices paint above the main panel: hit-test front to back so
		// overlapping panels only blur the one the visitor sees on top.
		const panel = [...scene.querySelectorAll(".login-preview, .hero-notice")].reverse().find(panel => {
			const bounds = panel.getBoundingClientRect();
			return bounds.width > 0 && bounds.height > 0
				&& event.clientX >= bounds.left && event.clientX <= bounds.right
				&& event.clientY >= bounds.top && event.clientY <= bounds.bottom;
		});
		if(!panel) return;
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
		pulse.addEventListener("finish", cleanup, {once: true});
		pulse.addEventListener("cancel", cleanup, {once: true});
	}, {passive: true});
	window.addEventListener("scroll", schedule, {passive: true});
	window.addEventListener("resize", schedule, {passive: true});
	window.addEventListener("pageshow", schedule);
	reducedMotion.addEventListener("change", () => {
		if(reducedMotion.matches) {
			for(const pulse of blurPulses.values()) pulse.cancel();
			blurPulses.clear();
		}
		schedule();
	});
	schedule();
}
