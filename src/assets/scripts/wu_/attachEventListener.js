/**
 * イベントリスナーの登録
 * like jQuery:on()
 * @param {HTMLElement | HTMLDocument} element
 * @param {String} eventName 半角スペース区切りで複数イベントの指定となる
 * @param {String} [elementSelector]
 * @param {Object} [options]
 * @param {Function} handler
 * @return {HTMLElement} element (for method chain.)
 */
function attachEventListener(element, ...args) {
	if(
		!HTMLElement ||
		!(element instanceof HTMLElement || element instanceof HTMLDocument)
	) {
		throw new TypeError("arguments[0] must be instance of HTMLElement or HTMLDocument.");
	}
	
	const handler = args.pop();
	if(typeof handler !== "function") {
		throw new TypeError("arguments[-1] must be function.");
	}
	
	const [eventName, elementSelector, options] = args;
	
	if(!eventName || typeof eventName !== "string") {
		throw new TypeError("arguments[1] must be string and is required.");
	}
	
	const isDelegate = (elementSelector && typeof elementSelector === "string");
	const handleFunction = isDelegate ? e => {
		const delegateTarget = element;
		let eventObject = {
			target: e.target,
			delegateTarget,
			preventDefault() {
				this.originalEvent.preventDefault();
			},
			stopPropagation() {
				this.originalEvent.stopPropagation();
			},
			stopImmediatePropagation() {
				this.originalEvent.stopPropagation();
			}
		};
		
		// loop parent nodes from the target to the delegation node
		for(let target = e.target; target && target !== delegateTarget; target = target.parentNode) {
			if( target.matches(elementSelector) ) {
				eventObject = { ...e, ...eventObject, originalEvent: e, currentTarget: target };
				break;
			}
		}
		
		if(eventObject.currentTarget) {
			handler.call(eventObject.currentTarget, eventObject);
		}
		
	} : handler;
	
	const handleOptions = (typeof options === "object") ? options : isDelegate;
	
	const types = eventName.split(" ");
	const len = types.length;
	for(let i = 0; i < len; i++) {
		const eventType = types[i];
		element.addEventListener(eventType, handleFunction, handleOptions);
	}
	
	return element;
}

export default attachEventListener;
