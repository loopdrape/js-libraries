/** extend RegExp  */
RegExp.escape = function escape(str) {
	//		return (typeof str === "string") ? str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") : str;
	return typeof str === "string" ? str.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&") : str;
};
