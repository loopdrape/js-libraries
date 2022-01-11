/* eslint-env node */
require('module-alias/register');

const path = require("path");
const util = require("./util");

util.updSourceMap(path.resolve(__dirname, "../"), "dist");
