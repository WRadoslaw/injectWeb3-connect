// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'

const config = {
	entry: {
		index: './src/index.ts',
		'index.min': './src/index.ts',
	},
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		library: 'injectweb3-connect',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},
	plugins: [
		// Add your plugins here
		// Learn more about plugins from https://webpack.js.org/configuration/plugins/
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				loader: 'ts-loader',
				exclude: ['/node_modules/'],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: 'asset',
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: 'svg-url-loader',
						options: {
							limit: 10000,
						},
					},
				],
			},

			// Add your rules for custom modules here
			// Learn more about loaders from https://webpack.js.org/loaders/
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
	},
}

module.exports = () => {
	if (isProduction) {
		config.mode = 'production'
	} else {
		config.mode = 'development'
	}
	return config
}
