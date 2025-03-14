const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8192,
          },
        },
      },
      {
        test: /\.(glsl|vert|frag|fx)$/,
        type: "asset/source",
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/sketches",
          to: "sketches",
          globOptions: {
            ignore: ["**/*.js"],
          },
        },
      ],
    }),
  ],
};
