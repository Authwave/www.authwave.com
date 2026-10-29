// Enhance Flair's radio-backed showcase without changing touch or keyboard use.
const mouseHover = matchMedia("(any-hover: hover) and (any-pointer: fine)");

for(const copy of document.querySelectorAll(".showcase-item > .showcase-copy")) {
	copy.addEventListener("pointerenter", event => {
		if(event.pointerType !== "mouse" || !mouseHover.matches) return;
		const choice = copy.parentElement.querySelector(':scope > input[type="radio"]');
		// The radios are hidden entirely in the mobile carousel layout.
		if(choice && !choice.disabled && !choice.checked && choice.getClientRects().length) {
			choice.click();
		}
	});
}
