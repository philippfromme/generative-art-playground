const HtmlWebpackPlugin = require('html-webpack-plugin');

const sketch = process.env.SKETCH || 'hello-world';

module.exports = {
  entry: `./src/sketches/${sketch}.js`,
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