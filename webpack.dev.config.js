const { merge } = require('webpack-merge');
const DashboardPlugin = require("webpack-dashboard/plugin");

const baseConfig = require('./webpack.base.config');
const { DefinePlugin } = require('webpack')

module.exports = merge(baseConfig, {
    mode: 'development',
    entry: [
        "react-hot-loader/patch",
        "webpack-dev-server/client?http://localhost:8080",
        "./renderer/app.tsx"
    ],
    // resolve: {
    //     alias: {
    //         'react-dom': '@hot-loader/react-dom'
    //     }
    // },
    devServer: {
        hot: "only",
        historyApiFallback: true
    },
    devtool: "cheap-module-source-map",
    // devServer: {
    //     port: 2003,
    //     compress: true,
    //     hot: true,
    //     headers: { 'Access-Control-Allow-Origin': '*' },
    //     // disableHostCheck: true,
    //     historyApiFallback: {
    //         verbose: true,
    //         disableDotRule: false
    //     },
    //     devMiddleware: {
    //         stats: 'errors-only',
    //     }
    // },
    plugins: [
        new DashboardPlugin()
    ]
});
