const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
	mode: 'development',

	devServer: {
		contentBase: path.join(__dirname, '../../dist'),
		port: 3000,
		hot: true,
		client: {
			logging: 'error',
		},
	},
});