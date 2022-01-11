import it from "./isType";

export default {
	/**
	 * 配列的なオブジェクトを配列に変換
	 * @param {Object | Array} arg: 配列的なオブジェクト
	 * @returns {Array} 変換された配列
	 */
	getAsArray(arg) {
		return Array.prototype.slice.call(arg, 0);
	},
	
	/**
	 * 第一引数で渡されたオブジェクトに第二引数のキーが存在するか
	 * @param {Object} obj
	 * @param {String} key
	 */
	hasProperty(obj, key) {
		if( !it.isObject(obj) ) {
			throw new TypeError("arguments[0] must be Object.");
		}
		if( !it.isString(key) ) {
			throw new TypeError("arguments[1] must be String.");
		}
		
		return Object.prototype.hasOwnProperty.call(obj, key);
	},
	
	/**
	 * 左0埋め
	 * @param {String | Number} target
	 * @param {Number} length
	 * @returns {String}
	 */
	zeroPadding(target, length) {
		it.isNumber(target) && ( target = String(target) );
		it.isNumber(length) || (length = target.length);
		
		if( !it.isString(target) ) {
			throw new TypeError("arguments[0] must be string or number.");
		}
		
		if(target.length >= length) {
			return target;
		}
		
		return (new Array(length).join("0") + target).slice(length * -1);
	},
	
	/**
	 * 文字列からHTMLタグを置換して返す
	 * @param {String} str: 対象文字列
	 * @param {String} [replacement=""]: 置換文字列
	 * @returns {String}
	 */
	replaceHtmlTag(str, replacement) {
		if( !it.isString(str) ) {
			throw new TypeError("arguments[0] must be string.");
		}
		
		it.isString(replacement) || (replacement = "");
		return str.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, replacement);
	},
	
	/**
	 * 改行を含む可能性のある文字列をHTML文字列に変換
	 *
	 * @param {String} str: 変換元文字列
	 * @param {boolean} isBlock: 行ごとにブロック要素とするか
	 * @returns {String} HTML文字列
	 */
	textareaParse(str, isBlock) {
		if( !it.isString(str) ) {
			throw new TypeError("arguments[0] must be string.");
		}
		
		it.isBoolean(isBlock) || (isBlock = false);
		
		const arr = str.split(/\r\n|\r|\n/); // 改行コードで分割
		const len = arr.length;
		const txts = [];
		const elm = document.createElement(isBlock ? "p" : "span");
		
		for(let i = 0; i < len; i++) {
			arr[i] || (arr[i] = "&nbsp;");
			elm.innerHTML = arr[i];
			txts.push(elm.outerHTML);
		}
		
		return txts.join(isBlock ? "" : "<br/>");
	},
	
	/**
	 * 文字列をHTMLCollectionにパースする
	 * @param {String} str: HTML文字列
	 * @returns {HTMLCollection}
	 */
	parseHTML(str) {
		if( !it.isString(str) ) {
			throw new TypeError("arguments[0] must be string.");
		}
		
		const doc = document.implementation.createHTMLDocument();
		const base = doc.createElement("base");
		base.href = document.location.href;
		doc.head.appendChild(base);
		
		doc.body.innerHTML = str;
		
		// remove scripts
		const scripts = doc.getElementsByTagName("script");
		!!scripts.length && scripts.forEach(elm => {
			elm.parentNode.removeChild(elm);
		});
		
		return doc.body.children;
	},
	
	/**
	 * create Instance metod
	 * @param {Function} Func: コンストラクタ
	 * @returns Instance
	 */
	newCall(Func) {
		return new ( Function.prototype.bind.apply(Func, arguments) )();
	}
};
