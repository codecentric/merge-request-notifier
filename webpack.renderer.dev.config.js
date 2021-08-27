const { merge } = require('webpack-merge');
const DashboardPlugin = require("webpack-dashboard/plugin");

const baseConfig = require('./webpack.renderer.config');

module.exports = merge(baseConfig, {
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    devServer: {
        port: 2003,
        compress: true,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false
        },
        devMiddleware: {
            stats: 'errors-only',
        }
    },
    plugins: [
        new DashboardPlugin()
    ]
});
