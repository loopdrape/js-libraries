const path = require("path");
const globule = require("globule");
const fs = require("fs");

/**
 * ファイルの削除関数
 * options
 * - {Array | String} patterns: 対象パターン
 * - {String} [path]: 対象ディレクトリ
 * - {Array | String} [exclude]: 除外パターン
 * @param {Object} options
 * @returns
 */
function deleteFiles(options) {
	if( !options || typeof options !== "object" || Array.isArray(options) ) {
		throw new TypeError("arguments[0] must be object");
	}
	
	if(typeof options.patterns === "string") {
		options.patterns = [options.patterns];
	}
	if( !Array.isArray(options.patterns) ) {
		throw new TypeError("`patterns` must be array");
	}
	
	if(!options.path || typeof options.path !== "string") {
		options.path = __dirname;
	}
	
	if( !options.exclude || !Array.isArray(options.exclude) ) {
		if(typeof options.exclude === "string") {
			options.exclude = [options.exclude];
		} else {
			options.exclude = [
				"**/node_modules/**/*"
			];
		}
	}
	
	options.exclude = options.exclude.map(pattern => `!${pattern}`);
	
	const deletedList = [];
	for(const pattern of options.patterns) {
		const filesMatched = globule.find([
			pattern
		].concat(options.exclude), {
			cwd: options.path
		});
		
		for(const fileName of filesMatched) {
			const fpath = path.resolve(options.path, fileName);
			try {
				fs.unlinkSync(fpath);
				deletedList.push(fpath);
			} catch(error) {
				deletedList.push(`${error.message}::${fpath}`);
				break;
			}
		}
	}
	return deletedList;
}

module.exports = deleteFiles;
