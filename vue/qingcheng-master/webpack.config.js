var webpack = require("webpack");

var ExtractTextPlugin = require("extract-text-webpack-plugin");
var cssLoader = ExtractTextPlugin.extract("style", "css?sourceMap!postcss")

var publicPath = "/build/";

var pkg = require('./package.json')
var vendor = Object.keys(pkg.dependencies)

module.exports = {
  entry: {
    app: ["./src/ga.js", "./src/index.js", "./lib/css/responsive.css", "./css/index.css"],
    vendor: vendor,
  },

  output: {
    path: __dirname + publicPath,
    filename: 'app.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: function(info) {
      return info.resource;
    }
  },

  module: {
    loaders: [
      {test: /\.vue$/, loader: 'vue'},
      {test: /\.css$/, loader: cssLoader},
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'},
    ]
  },

  plugins: [
      new ExtractTextPlugin("app.css", {disable: false}),
      new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
  ],

  postcss: function () {
    // use webpack context
    var postcssImport = require('postcss-import');

    return [
      postcssImport({
        onImport: function (files) {
          files.forEach(this.addDependency);
        }.bind(this)
      }),

      require('postcss-custom-properties'),
    ]
  },

  vue: {
    loaders: {
      css: cssLoader,
    }
  },

  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime'],
  },

  devtool: "source-map",
};
