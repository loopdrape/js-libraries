/* eslint-env node */

const config = {};

switch(process.env.B_TYPE) {
	case "libraries": {
		const configByType = require("./webpack.config.libraries");
		Object.assign(config, configByType);
		break;
	}
	
	default: {
		const configByType = require("./webpack.config.pages");
		Object.assign(config, configByType);
		break;
	}
}

module.exports = config;
