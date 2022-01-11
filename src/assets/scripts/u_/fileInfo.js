import it from "./isType";

export default {
	/**
	 * ファイルサイズ（Byte）を文字列にフォーマットする
	 * @param {Number} fsize
	 * @returns {String}
	 */
	fileSizeToString(fsize) {
		if( !it.isNumber(fsize) ) {
			throw new TypeError("fileSizeToString: arguments[0] must be number.");
		}
		
		let fstr = fsize / 1024;
		if(fstr >= 1024) {
			fstr = fstr / 1024;
			if(fstr >= 1024) {
				fstr = `${Math.ceil(fstr / 1024)}GB`;
			} else {
				fstr = `${Math.ceil(fstr)}MB`;
			}
		} else {
			fstr = `${Math.ceil(fstr)}KB`;
		}
		return fstr;
	},
	
	/**
	 * ファイルパス、URLに関する情報を返す
	 * @param {String} path
	 * @returns {Object}
	 */
	pathInfo(path) {
		if( !it.isString(path) ) {
			throw new TypeError("pathInfo: arguments[0] must be string.");
		}
		
		const _a = document.createElement("a");
		
		_a.href = path || "./";
		path = path.replace(_a.search, "").replace(_a.hash, "");
		
		const delimiter = path.indexOf("/") >= 0 ? "/" : "\\";
		const pathParts = path.split(delimiter);
		const basename = pathParts.slice(-1)[0];
		const arr = basename.split(".");
		
		return {
			dirname: pathParts.slice(0, -1).join("/"),
			basename: basename,
			filename: arr.shift(),
			extension: arr.pop() || "",
			search: _a.search,
			hash: _a.hash
		};
	},
	
	/**
	 * 第1引数の文字列内の{dirname}, {basename}, {extension}, {filename}を置換
	 * @param {String} str: 置換対象の文字列
	 * @param {String} path: ファイルのパス
	 * @returns {String} 置換後の文字列
	 */
	replacePathinfo(str, path) {
		if(!it.isString(str) || !it.isString(path)) {
			return str;
		}
		
		const pathInfo = this.pathInfo(path);
		str = str.replace(/\{dirname\}/g, pathInfo.dirname);
		str = str.replace(/\{basename\}/g, pathInfo.basename);
		str = str.replace(/\{extension\}/g, pathInfo.extension);
		str = str.replace(/\{filename\}/g, pathInfo.filename);
		return str;
	}
};
