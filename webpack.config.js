const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        popup: './src/js/popup.js',
        content: './src/js/content.js',
        background: './src/js/background.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist/js')
    },
    resolve: {
        extensions: ['.js']
    }
}; 