// Flux handles requests, updates, history and scrolling. Preserve native browser
// actions that its link handler otherwise intercepts, such as Ctrl/Cmd-click.
document.addEventListener("click", event => {
	const link = event.target.closest?.('a[data-flux~="link"]');
	if(!link) return;
	if(event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
		event.stopPropagation();
		return;
	}
}, {capture: true});
