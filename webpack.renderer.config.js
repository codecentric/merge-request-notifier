const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    target: 'electron-renderer',
    entry: {
        app: ['@babel/polyfill', '@electron/remote', './src/renderer/app.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        [
                            '@babel/preset-env',
                            { targets: { browsers: 'last 2 versions ' } }
                        ],
                        '@babel/preset-typescript',
                        '@babel/preset-react'
                    ],
                    plugins: [
                        ['@babel/plugin-proposal-class-properties', { loose: true }],
                        '@babel/plugin-proposal-optional-chaining'
                    ]
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.(ico|jpe?g|png|gif|eot|otf|webp|mp4|svg|ttf|woff|woff2)$/,
                loaders: ['file-loader']
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    optimization: {
        namedModules: true
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                enabled: true,
                configFile: 'src/renderer/tsconfig.json',
                // reportFiles: ['src/renderer/**/*'],
            }
        }),
        new HtmlWebpackPlugin()
    ]
});
