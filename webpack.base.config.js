const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist/renderer-bundle'),
        filename: '[name].js'
    },
    node: {
        __dirname: false,
        __filename: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    devtool: 'source-map',
    plugins: [
        new HardSourceWebpackPlugin()
    ]
};
