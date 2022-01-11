const path = require("path");
const globule = require("globule");

/**
 * `entry`生成用関数
 * options
 * - {Array | String} targets: 対象ファイルの拡張子
 * - {String} [path]: 対象ディレクトリ
 * - {Array | String} [exclude]: 除外パターン
 * @param {Object} options
 * @returns {Object} entry
 */
function getEntriesList(options) {
	if( !options || typeof options !== "object" || Array.isArray(options) ) {
		throw new TypeError("arguments[0] must be object");
	}
	
	if(typeof options.targets === "string") {
		options.targets = [options.targets];
	}
	if( !Array.isArray(options.targets) ) {
		throw new TypeError("`targets` must be array");
	}
	
	if(!options.path || typeof options.path !== "string") {
		options.path = __dirname;
	}
	
	if( !options.exclude || !Array.isArray(options.exclude) ) {
		if(typeof options.exclude === "string") {
			options.exclude = [options.exclude];
		} else {
			options.exclude = [
				"**/_*",
				"**/_*/**/*",
				"**/node_modules/**/*"
			];
		}
	}
	
	options.exclude = options.exclude.map(pattern => `!${pattern}`);
	
	const entriesList = {};
	for(const inputExt of options.targets) {
		const filesMatched = globule.find([
			`**/*.${inputExt}`
		].concat(options.exclude), {
			cwd: options.path
		});
		
		// entriesList[inputExt] = filesMatched;
		
		for(const inputName of filesMatched) {
			const outputName = inputName.replace(new RegExp(`.${inputExt}$`, "i"), "");
			const inputPath = path.resolve(options.path, inputName);
			
			if( Object.hasOwnProperty.call(entriesList, outputName) ) {
				if( !Array.isArray(entriesList[outputName]) ) {
					entriesList[outputName] = [entriesList[outputName]];
				}
				entriesList[outputName].push(inputPath);
				
			} else {
				entriesList[outputName] = inputPath;
			}
		}
	}
	return entriesList;
}

module.exports = getEntriesList;
