
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

config.entry.app.unshift("webpack-dev-server/client?http://localhost:9090", "webpack/hot/dev-server");

config.plugins.push(new webpack.HotModuleReplacementPlugin());

config.devtool = 'eval';

var proxy = {
  "/api/*": {target: "http://python-china.org", host: "python-china.org"},
};
if (process.env.NODE_ENV === 'local') {
  proxy = {
    "/api/*": "http://192.168.30.12:5000",
    "/session*": "http://192.168.30.12:5000",
  };
}

var app = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  proxy: proxy,
  hot: true,
});

app.listen(9090, '0.0.0.0', function (err, result) {
  console.log('http://localhost:9090');
  if (err) {
    console.log(err);
  }
});
