const path = require("path");
const webpack = require("webpack");

module.exports = {
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist")
  },

  entry: path.join(__dirname, "index.js"),

  cache: true,
  debug: false,
  devtool: false, //"inline-source-map",

  externals: {},

  stats: {
    colors: true,
    reasons: true
  },

  resolve: {
    extensions: ["", ".js"],
    modulesDirectories: [ "src", "node_modules" ]
  },

  eslint: {
    configFile: ".eslintrc"
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: "babel",
      query: {}
    }]
  },

  plugins: [
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.DedupePlugin(),
    // new webpack.optimize.UglifyJsPlugin()
  ]
};
