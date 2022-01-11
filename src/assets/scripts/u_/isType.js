const it = {
	/**
	 * Object判定
	 * nullおよびArrayの場合はfalse
	 * @param {mixed} arg
	 * @returns {Boolean}
	 */
	isObject(arg) {
		return typeof arg === "object" && arg !== null && !Array.isArray(arg);
	},
	
	/**
	 * Array判定（Array.isArrayのエイリアス）
	 * @param {mixed} arg
	 * @returns {Boolean}
	 */
	isArray(arg) {
		return Array.isArray(arg);
	},
	
	/**
	 * Boolean判定
	 * @param {mixed} arg
	 * @returns {Boolean}
	 */
	isBoolean(arg) {
		return typeof arg === "boolean";
	},
	
	/**
	 * String判定
	 * @param {mixed} arg
	 * @returns {Boolean}
	 */
	isString(arg) {
		return typeof arg === "string";
	},
	
	/**
	 * Number判定
	 * NaNはfalse
	 * @param {mixed} arg
	 * @returns {Boolean}
	 */
	isNumber(arg) {
		return typeof arg === "number" && !isNaN(arg);
	},
	
	/**
	 * Integer判定
	 * @param {mixed} arg
	 * @returns {Boolean}
	 */
	isInteger(arg) {
		return it.isNumber(arg) && Math.round(arg) === arg;
	},
	
	/**
	 * 数値と認められる値かどうかの判定
	 * @param {mixed} arg
	 * @param {mixed} [flgStrict]: trueの場合に厳密に判定を行う（"1s"はfalse）
	 * @returns {Boolean}
	 */
	isNumeric(arg, flgStrict) {
		const t = typeof arg;
		return (t === "number" || t === "string") && !isNaN( parseFloat(arg) - (flgStrict ? arg : 0) );
	},
	
	/**
	 * Function判定
	 * @param {mixed} arg
	 * @returns {Boolean}
	 */
	isFunction(arg) {
		return typeof arg === "function";
	},
	
	/**
	 * HTMLElement判定
	 * @param {mixed} arg
	 * @returns {Boolean}
	 */
	isHTMLElement(arg) {
		try {
			//Using W3 DOM2 (works for FF, Opera and Chrom)
			return arg instanceof HTMLElement;
		} catch(e) {
			//Browsers not supporting W3 DOM2 don't have HTMLElement and
			//an exception is thrown and we end up here. Testing some
			//properties that all elements have. (works on IE7)
			return (
				typeof arg === "object" &&
				arg.nodeType === 1 &&
				typeof arg.style === "object" &&
				typeof arg.ownerDocument === "object"
			);
		}
	}
};

export default it;
