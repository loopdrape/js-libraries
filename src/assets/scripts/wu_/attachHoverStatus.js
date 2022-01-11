import attachEventListener from "./attachEventListener";
import deviceInfo from "./deviceInfo";

function attachHoverStatus() {
	const hoverClassName = "is-hover";
	const hoverDecayTime = (deviceInfo[0] === "sp") ? 250 : 0;
	
	window.addEventListener("pageshow", e => {
		// [reset]
		const elements = document.getElementsByClassName(hoverClassName);
		const len = elements.length;
		for(let i = 0; i < len; i++) {
			elements.item(i).classList.remove(hoverClassName);
		}
	}, false);
	
	const selector = "a, button, label, .hover-target";
	attachEventListener(document.body, "mouseenter touchstart", selector, e => {
		!!e.currentTarget && e.currentTarget.classList.add(hoverClassName);
	});
	
	attachEventListener(document.body, "mouseleave touchend", selector, e => {
		setTimeout(() => {
			!!e.currentTarget && e.currentTarget.classList.remove(hoverClassName);
		}, hoverDecayTime);
	});
	
	return true;
}

export default attachHoverStatus;
