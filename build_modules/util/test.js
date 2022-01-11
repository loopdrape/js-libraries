const util = require("./index");

let result = util.getEntriesList({
	targets: ["js"],
	path: __dirname,
	exclude: [
		"**/_*",
		"**/node_modules/**/*"
	]
});

console.log("getEntriesList", result);

result = util.deleteFiles({
	patterns: ["**/*.bundle.js"],
	path: __dirname + "/../del"
});

console.log("deleteFiles", result);
