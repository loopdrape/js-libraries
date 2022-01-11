import attachEventListener from "./attachEventListener";

export default function onDocumentReady(callback) {
	if(typeof callback !== "function") {
		throw new TypeError("arguments[0] must be function.");
	}
	
	if(document.readyState !== "loading") {
		callback();
	} else {
		attachEventListener(document, "DOMContentLoaded", callback);
	}
}
