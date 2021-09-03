const { merge } = require('webpack-merge');

const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    mode: 'production',
    entry: {
        app: ['./renderer/app.tsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist/renderer'),
        filename: '[name].js'
    },
    devtool: "source-map",
    plugins: [],
});
