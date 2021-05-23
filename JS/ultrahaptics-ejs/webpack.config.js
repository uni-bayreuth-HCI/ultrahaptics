const path = require('path');
const MinifyPLugin = require("babel-minify-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const loader = require('sass-loader');

module.exports = {
    mode:'development',
    devtool: 'source-map',
    context: path.resolve(__dirname, 'src'),
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new MinifyPLugin({},{
            comments: false
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]

}