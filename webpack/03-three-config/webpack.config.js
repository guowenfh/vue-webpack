const webpack = require('webpack')
const path = require('path')
module.exports = {
  entry: ['./entry.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [new webpack.BannerPlugin('这里是打包文件头部注释')]
}
