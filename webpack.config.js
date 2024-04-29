const HtmlWebpackPlugin = require('html-webpack-plugin');

const sketch = process.env.SKETCH || 'hello-world';

// check if ./src/sketches/${sketch} is directory and if so, use index.js
const fs = require('fs');

let entry = `./src/sketches/${sketch}`;

if (fs.existsSync(entry)) {
  if (fs.lstatSync(entry).isDirectory()) {
    entry = `./src/sketches/${sketch}/index.js`;
  } else {
    entry = `./src/sketches/${sketch}.js`;
  }
}

module.exports = {
  entry,
  output: {
    path: __dirname + '/dist',
    filename: 'sketch.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    })
  ]
};