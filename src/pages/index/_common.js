import u_ from "@@libraries/u_";
import wu_ from "@@libraries/wu_";

const {
	attachHoverStatus,
	browserInfo,
	deviceInfo,
	onDocumentReady
} = wu_;

onDocumentReady(() => {
	document.body.setAttribute("data-browser", browserInfo.join("-"));
	document.body.setAttribute("data-device", deviceInfo.join("-"));
	document.body.setAttribute("data-pixel-ratio", window.devicePixelRatio || "");
	
	attachHoverStatus();
	
	document.body.classList.add("is-ready");
});

window.u_ = u_;

export { u_, wu_ };
