/* eslint-env node */
require('module-alias/register');

const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const util = require("@@build/util");
const npmPackage = JSON.parse( fs.readFileSync("package.json", "utf8") );
// const packageName = npmPackage.name.split("/").pop();

const config = {};

// [entry point]
config.entry = util.getEntriesList({
	targets: ["js", "scss"],
	path: path.resolve(__dirname, "src", "libraries")
});

// [output]
let isProd = false;
switch(process.env.NODE_ENV) {
	case "production": {
		isProd = true;
	} break;
}

const outputDir = "dist";

config.output = {
	path: `${__dirname}/${outputDir}`,
	filename: `[name].${isProd ? "min." : ""}js`,
	chunkFilename: `[id].${isProd ? "min." : ""}js`,
	library: "[name]",
	libraryTarget: "umd",
	// libraryExport: "default",
	globalObject: "this",
};

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
			vendors: {
				test: /[\\/]node_modules[\\/]/,
				priority: 1
			},
			common: {
				minChunks: 10,
				reuseExistingChunk: true,
				priority: 0
			}
		},
		name(module, chunks, cacheGroupKey) {
//			return (chunks.length === 1) ? chunks[0].name : cacheGroupKey;
			return cacheGroupKey;
		},
		minSize: 300000,
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

config.plugins = [
	new webpack.DefinePlugin({
		PACKAGE_VERSION: JSON.stringify(npmPackage.version),
		NODE_ENV: JSON.stringify(process.env.NODE_ENV || "")
	}),
	new MiniCssExtractPlugin({
		moduleFilename({ name }) {
			return `[name].${isProd ? "min." : ""}css`;
		},
		chunkFilename: `[id].${isProd ? "min." : ""}css`
	}),
	new StyleLintPlugin({
		fix: true,
		files: "**/*.s?(a|c)ss"
	})
];


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
	}]
};


module.exports = config;
