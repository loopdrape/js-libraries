import it from "./isType";

export default {
	/**
	 * オブジェクトの中身に再帰的に処理を実行し、戻り値を適用する
	 *
	 * @param {Object} data: 処理対象のオブジェクト
	 * @param {Function} cb: コールバック関数
	 * @param {mixed} self: cbのcaller
	 * @returns this
	 */
	mapRecursive(data, cb, self) {
		if(typeof data !== "object" || data === null) {
			throw new TypeError("arguments[0] must be object or array.");
		}
		
		it.isFunction(cb) || (cb = () => {});
		
		const isArray = Array.isArray(data);
		const arr = isArray ? data : Object.keys(data);
		const len = arr.length;
		for(let i = 0; i < len; i++) {
			const k = isArray ? i : arr[i];
			
			if(typeof data[k] !== "object" || data[k] === null) {
				const r = cb.call(self, data[k], k);
				if(r !== undefined) {
					data[k] = r;
				}
			} else {
				this.mapRecursive(data[k], cb, self);
			}
		}
		
		return this;
	}
};
