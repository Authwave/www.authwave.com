// Without JavaScript every feature stays readable.
// TODO: Extract into their own script files.
for(const showcase of document.querySelectorAll("[data-authwave-features]")) {
	const features = Array.from(showcase.querySelectorAll(".authwave-feature"));
	const controls = showcase.querySelector(".authwave-feature-controls");
	const previous = controls.querySelector("[data-feature-previous]");
	const next = controls.querySelector("[data-feature-next]");
	const progress = controls.querySelector("progress");
	const status = controls.querySelector(".feature-status");
	const breakpoint = getComputedStyle(showcase).getPropertyValue("--authwave-wide-breakpoint").trim();
	const wide = matchMedia(`(min-width: ${breakpoint})`);
	let selected = 0;
	const render = () => {
		features.forEach((feature, index) => {
			feature.hidden = !wide.matches && index !== selected;
			feature.dataset.active = String(index === selected);
		});
		controls.hidden = wide.matches;
		previous.disabled = selected === 0;
		next.disabled = selected === features.length - 1;
		progress.max = features.length;
		progress.value = selected + 1;
		status.textContent = `${selected + 1} of ${features.length}: ${features[selected].querySelector("h3").textContent}`;
	};
	previous.addEventListener("click", () => {
		selected = Math.max(0, selected - 1);
		render();
	});
	next.addEventListener("click", () => {
		selected = Math.min(features.length - 1, selected + 1);
		render();
	});
	wide.addEventListener("change", render);
	render();
}

// Keep the example interactive without connecting it to an authentication service.
for(const form of document.querySelectorAll("[data-authwave-form]")) {
	form.addEventListener("submit", event => {
		event.preventDefault();
		form.closest(".authwave-login").querySelector("[data-authwave-result]").textContent = "This is a layout preview. No sign-in request was made.";
	});
}
