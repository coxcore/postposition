const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: "./src/postposition.js",

    output: {
        path: path.join(__dirname, "/dist"),
        filename: "cox.postposition.min.js",
        publicPath: "/dist",
        library: ["cox", "postposition"],
        libraryTarget: "umd",
    },

    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
        ],
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: false,
            },
            compress: {
                screw_ie8: true,
                drop_console: false,
            },
            comments: false,
        }),
    ],
};
