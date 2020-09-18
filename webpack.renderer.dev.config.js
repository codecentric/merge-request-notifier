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
        noInfo: true,
        stats: 'errors-only',
        inline: true,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false
        }
    },
    plugins: [
        new DashboardPlugin()
    ]
});
