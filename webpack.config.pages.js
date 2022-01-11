/* eslint-env node */
require('module-alias/register');

const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const util = require("@@build/util");
const npmPackage = JSON.parse( fs.readFileSync("package.json", "utf8") );
const packageName = npmPackage.name.split("/").pop();

const config = {};

// [entry point]
config.entry = util.getEntriesList({
	targets: ["js", "scss"],
	path: path.resolve(__dirname, "src", "pages")
});

// [output]
const { directories } = npmPackage;
const outputDir = "dist/demo";
const publicPagePath = !directories.page ? "" : `${directories.page}/`;

config.output = {
	path: `${__dirname}/${outputDir}`,
	filename: `${publicPagePath}[name].js`,
	chunkFilename: "assets/scripts/[id].js",
	publicPath: "/"
};

let isProd = false;

// override public path & isProd
switch(process.env.NODE_ENV) {
	case "production": {
		isProd = true;
		if(directories.production) {
			config.output.path += `/${directories.production}`;
			config.output.publicPath += `${directories.production}/`;
		}
	} break;
		
	case "test": {
		const dir = directories.test || "test";
		config.output.path += `/${dir}`;
		config.output.publicPath += `${dir}/`;
	} break;
}

// [mode]
config.mode = isProd ? "production" : "development";
const hash = !!process.env.NODE_ENV;


// [resolve]
if(npmPackage._moduleAliases) {
	const alias = {};
	for(const [k, v] of Object.entries(npmPackage._moduleAliases)) {
		alias[k] = path.join(__dirname, v);
	}
	
	config.resolve = { alias };
}


// [optimization]
// for minify
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
config.optimization = {
	splitChunks: {
		cacheGroups: {
			polyfill: {
				test: /[\\/]node_modules[\\/]core-js[\\/]/,
				enforce: true,
				priority: 5
			},
			vendors: {
				test: /[\\/]node_modules[\\/]/,
				priority: 1
			},
			common: {
				minChunks: 2,
				reuseExistingChunk: true,
				priority: 0
			}
		},
		name(module, chunks, cacheGroupKey) {
//			return (chunks.length === 1) ? chunks[0].name : cacheGroupKey;
			return cacheGroupKey;
		},
		minSize: 30000,
		chunks: "all"
	},
	namedModules: true,
	namedChunks: true,
	minimize: true,
	minimizer: [
		new TerserJSPlugin({
			sourceMap: true
		}),
		new OptimizeCSSAssetsPlugin({
			cssProcessorOptions: {
				map: {
					inline: false,
					annotation: true
				}
			}
		})
	]
};


// [devtool]
config.devtool = isProd ? "source-map" : "inline-source-map";


// [plugins]
// for styles
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");

// for copy files
const CopyWebpackPlugin = require("copy-webpack-plugin");

config.plugins = [
	new webpack.DefinePlugin({
		PACKAGE_VERSION: JSON.stringify(npmPackage.version),
		NODE_ENV: JSON.stringify(process.env.NODE_ENV || ""),
		PUBLIC_PATH: JSON.stringify(config.output.publicPath),
		PUBLIC_PAGE_PATH: JSON.stringify(`${config.output.publicPath}${publicPagePath}`),
	}),
	new webpack.IgnorePlugin(/^\.[\\/]locale$/, /moment$/),
	new MiniCssExtractPlugin({
		moduleFilename({ name }) {
			return `${publicPagePath}[name].css`;
		},
		chunkFilename: "assets/styles/[id].css"
	}),
	new StyleLintPlugin({
		fix: true,
		files: "**/*.s?(a|c)ss"
	}),
	new CopyWebpackPlugin([{
		from:  "**/+(*.pdf|*.json|*.txt|*.webp)",
		ignore: ["*.BK.*"],
		to: `${publicPagePath}[path][name].[ext]`,
	}], {
		context: "src/pages"
	}),
	new CopyWebpackPlugin([{
		from:  "**/*.webp",
		ignore: ["*.BK.*"],
		to: "assets/images/[path][name].[ext]",
	}], {
		context: "src/components"
	})
];

const copyListFromSrc = [{
	from: "**/+(*.php|*.pdf|*.json|*.txt|*.xml)",
	ignore: ["pages/**", "*.BK.*", "**/fonts/*.json", "*.test.*", "*.prod.*"]
}, {
	from: "**/*.webp",
	ignore: ["pages/**", "*.BK.*", "components/**"]
}, {
	from: "**/.htaccess",
	ignore: ["pages/**"]
}, {
	from: "**/web.config",
	ignore: ["pages/**"]
}, {
	from:  "**/.gitkeep",
	ignore: ["pages/**"]
}, {
	from:  "favicon/**"
}];

switch(process.env.NODE_ENV) {
	case "production": {
		copyListFromSrc.push({
			from:  "pages/prod.htaccess",
			to:  ".htaccess",
			toType: "file"
		});
		break;
	}
	
	case "test": {
		copyListFromSrc.push({
			from:  "pages/test.htaccess",
			to:  ".htaccess",
			toType: "file"
		}, {
			from:  "pages/test.htpasswd",
			to:  ".htpasswd",
			toType: "file"
		});
		break;
	}
}

config.plugins.push( new CopyWebpackPlugin(copyListFromSrc, {
	context: "src"
}) );

// for ejs
const HtmlWebpackPlugin = require("html-webpack-plugin");
const splittedChunks = Object.keys(config.optimization.splitChunks.cacheGroups);
Object.keys(config.entry).forEach(chunk => {
	try {
		fs.statSync( path.resolve(__dirname, "src", "pages", `${chunk}.ejs`) );
	} catch(err) {
		return true;
	}
	
	const pinfo = path.parse(chunk);
	const pageKey = `${pinfo.dir}${pinfo.name === "index" ? "" : `/${pinfo.name}`}`;
	const fname = (pinfo.dir === "index") ? pinfo.name : `${publicPagePath}${chunk}`;
	const chunks = [...splittedChunks, chunk];
	
	config.plugins.push(
		new HtmlWebpackPlugin({
			template: `./src/pages/${chunk}.ejs?pageKey=${pageKey}&fname=${fname}`,
			meta: {
				viewport: "width=device-width"
			},
			inject: "body",
			chunks,
			hash,
			filename: `${fname}.html`
		})
	);
});


// [module]
// for postcss-loader
const autoprefixer = require("autoprefixer");

// for sass-loader
const onceImporter = require("node-sass-once-importer");

// for file-loader
const getNameForFileLoader = require("@@build/getNameForFileLoader");

config.module = {
	rules: [{
		enforce: "pre",
		test: /\.js$/,
		exclude: [/node_module/],
		loader: "eslint-loader",
		options: {
			fix: true
		}
	}, {
		test: /\.js$/,
		exclude: [/node_modules[/|\\]/],
		use: {
			loader: "babel-loader",
			options: {
				presets: [
					["@babel/preset-env", {
						targets: {
							ie: 11
						},
						useBuiltIns: "usage",
						debug: !isProd,
						corejs: 3
					}]
				]
			}
		}
	}, {
		test: /\.(sa|sc|c)ss$/,
		use: [{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: !isProd,
				reloadAll: true,
			}
		}, {
			loader: "css-loader",
			options: {
//					url: false,
				sourceMap: true
			}
		}, {
			loader: "postcss-loader",
			options: {
				sourceMap: true,
				plugins: [
					autoprefixer({
						grid: true
					})
				]
			}
		}, {
			loader: "sass-loader",
			options: {
				sourceMap: true,
				sassOptions: {
					importer: onceImporter()
				}
			}
		}]
	}, {
		test: /\.(jpe?g|png|webp|gif)$/i,
		use: {
			loader: "file-loader",
			options: {
				name(file) {
					return getNameForFileLoader(file, "images", hash);
				}
			}
		}
	}, {
		test: /[\\/]fonts?[\\/].+\.(woff(2)?|eot|ttf)(\?.+)?$/i,
		use: {
			loader: "file-loader",
			options: {
				name(file) {
					return getNameForFileLoader(file, "fonts", hash);
				}
			}
		}
	}, {
		test: /\.svg$/i,
		use: {
			loader: "file-loader",
			options: {
				name(file) {
					const dirname = /[\\/]fonts?[\\/]/.test(file) ? "fonts" : "images";
					return getNameForFileLoader(file, dirname, hash);
				}
			}
		}
	}, {
		test: /\.ejs$/,
		use: [{
			loader: "html-loader"
		}, {
			loader: "ejs-html-loader",
			options: {
				rmWhitespace: true,
				context: {
					NODE_ENV: process.env.NODE_ENV,
					PACKAGE_NAME: packageName,
					PUBLIC_PATH: config.output.publicPath.replace(/\/$/, ""),
					PUBLIC_PAGE_PATH: `${config.output.publicPath}${publicPagePath}`.replace(/\/$/, "")
				}
			}
		}]
	}]
};


// [devServer]
config.devServer = {
	host: "localhost",
	port: 3000,
	hot: true,
	inline: true,
	contentBase: path.join(__dirname, outputDir),
	watchContentBase: true,
	open: true,
	// openPage: "index.html",
	// proxy: {
	// 	"/api/*": {
	// 		target: 'http://localhost:80/',
	// 		secure: false,
	// 		changeOrigin: true
	// 	}
	// }
};

module.exports = config;
