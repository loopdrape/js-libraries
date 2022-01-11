import it from "./isType";

export default {
	/**
	 * 文字列内に半角カナが含まれているかのチェック
	 * @param {String} str: 対象文字列
	 * @returns {boolean}
	 */
	hasHalfKana(str) {
		if( !it.isString(str) ) {
			throw new TypeError("hasHalfKana: arguments[0] must be string.");
		}
		
		return /[ｦｧ-ｯｰｱ-ﾝﾞﾟ]/.test(str);
	},
	
	/**
	 * 文字列内に半角文字が含まれているかのチェック
	 * @param {String} str: 対象文字列
	 * @param {boolean} denyHalfKana: 半角カナを対象から除外するかどうか
	 * @returns {boolean}
	 */
	hasHalfChar(str, denyHalfKana) {
		if( !it.isString(str) ) {
			throw new TypeError("hasHalfChar: arguments[0] must be string.");
		}
		
		if(!denyHalfKana && this.hasHalfKana(str)) {
			return true;
		}
		
		const len = str.length;
		const re = /[｡｢｣､･]/;
		
		for(let i = 0; i < len; i++) {
			const c = str.charAt(i);
			// 1文字ずつ文字コードをエスケープし、その長さが4文字+2文字(%u)未満なら半角
			if( escape(c).length < 6 || re.test(c) ) {
				return true;
			}
		}
		return false;
	},
	
	/**
	 * 文字列内に全角文字が含まれているかのチェック
	 * @param {String} str: 対象文字列
	 * @returns {boolean}
	 */
	hasFullChar(str) {
		if( !it.isString(str) ) {
			throw new TypeError("hasFullChar: arguments[0] must be string.");
		}
		
		const len = str.length;
		const re = /[｡｢｣､･]/;
		
		for(let i = 0; i < len; i++) {
			const c = str.charAt(i);
			// 1文字ずつ文字コードをエスケープし、その長さが4文字+2文字(%u)以上なら全角
			if( escape(c).length >= 6 && !re.test(c) && !this.hasHalfKana(c) ) {
				return true;
			}
		}
		return false;
	}
};
