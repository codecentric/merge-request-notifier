const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'] // TODO: remove '.js', '.json' ??
    },
    context: resolve(__dirname, 'src'),
    node: {
        __dirname: false,
        __filename: false
    },
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
                ],
            }
        ]
    },
    // optimization: {
    //     moduleIds: 'named'
    // },
    plugins: [
        new HtmlWebpackPlugin()
    ],
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
};
