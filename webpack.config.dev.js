var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

const PROJECT_ROOT = __dirname
const PORT = 3000
const phaserModule = path.join(__dirname, '/node_modules/phaser/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
    debug: true,
    devtool: "source-map",
    entry: './index.js',
    output: {
        path: PROJECT_ROOT,
        filename: 'build.js',
        pathinfo: true
    }, 
	resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2,
        }
    },
    module: {
        loaders: [
			{ test: /pixi\.js/, loader: 'expose?PIXI' },
			{ test: /phaser-split\.js$/, loader: 'expose?Phaser' },
			{ test: /p2\.js/, loader: 'expose?p2' },	
            {
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, "node_modules"),
                    path.resolve(__dirname, "resources"),
                ],
                loader: "babel",
                query: {
                    presets: ["es2015"],
                    //  TODO add external helpers after closing issue
                    //  https://github.com/babel/babel-loader/issues/157
                    // "plugins": ["external-helpers-2"]
                }
            },
        ]
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        host: '0.0.0.0',
        port: PORT
    },
    resolveUrlLoader: {
        absolute: PROJECT_ROOT
    },
    plugins: [
        new HtmlWebpackPlugin({
			template: 'index.html'					 
		}),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"'
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ],

    node: {
        console: false,
        global: true,
        process: true,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: true
    }
};
