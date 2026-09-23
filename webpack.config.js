const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

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
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
             },
         ],
     },

    plugins: [
         new ESLintPlugin({
             extensions: ['js'],
             context: './src',
             emitError: true,
             emitWarning: true,
         }),
     ],
};
