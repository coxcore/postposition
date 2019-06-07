const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/postposition.js',

    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'cox.postposition.min.js',
        publicPath: '/dist',
        library: ['cox', 'postposition'],
        libraryTarget: 'umd',
        globalObject: '(typeof self !== \'undefined\' ? self : this)',
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
};
