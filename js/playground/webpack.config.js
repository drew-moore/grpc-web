const path = require('path');
module.exports = {
    entry: "./src/index.js",
    devtool: 'inline-source-map',
    output: {
        path: __dirname,
        filename: "build/bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: "babel", exclude: /node_modules/ }
        ]
    },
    resolve: { fallback: path.join(__dirname, "node_modules") },
    resolveLoader: { fallback: path.join(__dirname, "node_modules") }
};
