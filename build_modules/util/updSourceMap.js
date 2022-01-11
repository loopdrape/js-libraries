const fs = require("fs");
const path = require("path");
const getEntriesList = require("./getEntriesList");

/**
 * ソースマップのパスを更新
 *
 * @param {String} pathToRoot: パッケージのルートディレクトリのパス
 * @param {String} [documentDir = "dist"]: ドキュメントのルートディレクトリのパス
 * @param {String} [replace = "webpack://"]: 置換文字列
 * @returns this
 */
function updSourceMap(pathToRoot, documentDir, replace) {
	if( !pathToRoot || typeof pathToRoot !== "string") {
		throw new TypeError("arguments[0] must be string and is required.");
	}
	
	if( !documentDir || typeof documentDir !== "string" ) {
		documentDir = "dist";
	}
	
	if( !replace || typeof replace !== "string" ) {
		replace = "webpack://";
	}
	
	const files = getEntriesList({
		targets: ["map"],
		path: documentDir
	});
	
	const regToRoot = new RegExp(`^${RegExp.escape(pathToRoot)}/`);
	
	for( const fpath of Object.values(files) ) {
		const src = fs.readFileSync(fpath);
		let data = JSON.parse(src);
		data.sources = data.sources.map(v => v.replace(regToRoot, replace).split(path.sep).join("/"));
		data = JSON.stringify(data);
		fs.writeFileSync(fpath, data);
	}
	
	return this;
}

module.exports = updSourceMap;
