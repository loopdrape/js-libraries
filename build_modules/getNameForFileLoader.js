/* eslint-env node */
const path = require("path");
const fs = require("fs");
const npmPackage = JSON.parse( fs.readFileSync("package.json", "utf8") );

function getNameForFileLoader(filepath, dirname, needHash) {
	const dirs = ["assets"];
	(dirname && typeof dirname === "string") && dirs.push(dirname);
	
	const arr = filepath.split(path.sep);
	arr.pop();
	
	let i = arr.indexOf("node_modules");
	if(i >= 0) {
		let dir = arr[i + 1];
		if( /^@/.test(dir) ) {
			(dir !== "@pressmedia") && dirs.push( dir.slice(1) );
			dir = arr[i + 2];
		}
		dirs.push(dir);
		
	} else {
		i = arr.indexOf("src");
		!!i && arr.splice(0, i + 1);
		
		if(arr[0] === "pages") {
			// remove "assets" from dirs.
			dirs.shift();
			
			arr.shift();
			i = arr.indexOf(dirname);
			if(i >= 0) {
				// remove `${dirname}` from dirs.
				dirs.pop();
			}
			
			dirs.unshift(...arr);
			!!npmPackage.pageDir && dirs.unshift(npmPackage.pageDir);
			
		} else {
			const len = arr.length;
			i = arr.indexOf(dirname);
			if(i < 0) {
				i = arr.indexOf(dirs[0]);
				if(i < 0) {
					i = arr.indexOf("components");
					if(i < 0) {
						i = len - 2;
					}
				}
			}
			
			for(i += 1; i < len; i++) {
				dirs.push(arr[i]);
			}
		}
	}
	
	return `${dirs.join("/")}/[name].[ext]${!needHash ? "" : "?[contenthash]"}`;
}

module.exports = getNameForFileLoader;
