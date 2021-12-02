const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	stats: {
		assets: false,
		moduleAssets: false,
	},

	entry: {
		app: './src/index.js',
	},

	output: {
		path: __dirname + '/../build',
		publicPath: './public',
		filename: '[name].bundle.[contenthash:8].js'
	},

	stats: {
		modules: false
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			title: 'Face Recognition | Ali Yaghoubi',
			publicPath: '',
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: "public/assets", to: "assets" },
			],
		})
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.scss$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'sass-loader'
				}]
			}
		],
	},
};