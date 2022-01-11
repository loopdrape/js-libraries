/* eslint-env node */
require("./RegExp.escape");
const getEntriesList = require("./getEntriesList");
const deleteFiles = require("./deleteFiles");
const updSourceMap = require("./updSourceMap");

module.exports = {
	getEntriesList,
	deleteFiles,
	updSourceMap
};
