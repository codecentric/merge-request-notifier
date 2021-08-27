const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    target: 'electron-renderer',
    entry: {
        app: ['@babel/polyfill','./src/renderer/app.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            '@babel/preset-typescript',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            '@babel/plugin-proposal-optional-chaining'
                        ]
                    }
                },
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(ico|jpe?g|png|gif|eot|otf|webp|mp4|svg|ttf|woff|woff2)$/,
                type: 'asset/resource'
            }
        ]
    },
    optimization: {
        moduleIds: 'named'
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                enabled: true,
                configFile: 'tsconfig-renderer.json'
            }
        }),
        new HtmlWebpackPlugin()
    ]
});
