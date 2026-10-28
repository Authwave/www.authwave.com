const storageKey = "authwave-color-scheme";
const modes = ["system", "light", "dark"];
const icons = {system: "sun-moon", light: "sun", dark: "moon"};
const root = document.documentElement;
const button = document.querySelector("[data-theme-toggle]");

function readPreference() {
	try {
		const saved = localStorage.getItem(storageKey);
		return modes.includes(saved) ? saved : "system";
	}
	catch {
		return "system";
	}
}

// Match api.horse: the first click visibly changes the system's current scheme.
function sequence() {
	return matchMedia("(prefers-color-scheme: dark)").matches
		? ["system", "light", "dark"]
		: ["system", "dark", "light"];
}

let mode = readPreference();

function applyPreference() {
	if(mode === "system") delete root.dataset.colorScheme;
	else root.dataset.colorScheme = mode;

	if(!button) return;
	const order = sequence();
	const next = order[(order.indexOf(mode) + 1) % order.length];
	button.dataset.icon = icons[mode];
	button.dataset.themeMode = mode;
	button.querySelector("span").textContent = `${mode[0].toUpperCase()}${mode.slice(1)} theme`;
	button.setAttribute("aria-label", `Theme: ${mode}. Switch to ${next} theme.`);
	button.hidden = false;
}

applyPreference();
button?.addEventListener("click", () => {
	const order = sequence();
	mode = order[(order.indexOf(mode) + 1) % order.length];
	try {
		if(mode === "system") localStorage.removeItem(storageKey);
		else localStorage.setItem(storageKey, mode);
	}
	catch {
		// Apply the choice for this page even when browser storage is unavailable.
	}
	applyPreference();
});

// CSS follows live OS changes in System mode; keep the next-action label in sync.
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyPreference);
window.addEventListener("storage", event => {
	if(event.key !== storageKey && event.key !== null) return;
	mode = readPreference();
	applyPreference();
});
