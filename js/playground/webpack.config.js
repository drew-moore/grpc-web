const path = require('path');
module.exports = {
  entry: "./src/index.ts",
  devtool: 'inline-source-map',
  output: {
    path: __dirname,
    filename: "build/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        include: /src/,
        exclude: /node_modules/,
        loader: "babel-loader?cacheDirectory!ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
};
