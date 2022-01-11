import it from "./isType";
import fi from "./fileInfo";

export default {
	/**
	 * クエリ文字列をオブジェクトへパースする
	 * @param {String} search: クエリ文字列
	 * @returns {Object}
	 */
	parseQueryString(search) {
		if( !it.isString(search) ) {
			throw new TypeError("parseQueryString: arguments[0] must be string.");
		}
		
		const obj = {};
		
		if( !/^[.|/|?]/.test(search) && !/^https?:/.test(search) ) {
			// searchがURL形式じゃない場合の対処
			search = "?" + search;
		}
		
		// urlのsearch部分を取得
		let query = fi.pathInfo(search).search;
		
		// 最初に出現する?は取り除く
		query = query.replace(/^\?/, "");
		
		if(query) {
			query = query.split("&");
			const len = query.length;
			for(let i = 0; i < len; i++) {
				const q = query[i];
				const qArr = q.split("=").map((v, i) => {
					return decodeURIComponent(v);
				});
				
				obj[qArr.shift()] = qArr.join("=");
			}
		}
		
		return obj;
	},
	
	/**
	 * オブジェクトからクエリ文字列を生成
	 * @param {Object} obj: 生成元オブジェクト
	 * @returns {String} クエリ文字列
	 */
	createQueryString(obj) {
		if( !it.isObject(obj) ) {
			throw new TypeError("createQueryString: arguments[0] must be object.");
		}
		
		const arr = [];
		
		Object.keys(obj).forEach((k, i) => {
			arr.push(`${k}=${encodeURIComponent(obj[k])}`);
		});
		
		return !arr.length ? "" : "?" + arr.join("&");
	}
};
