const path = require('path')
const webpack = require('webpack')
// NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
// 模块导入
module.exports = {
  // 入口文件地址，不需要写完，会自动查找
  entry: './src/main',
  // 输出
  output: {
    path: path.join(__dirname, './dist'),
    // 文件地址，使用绝对路径形式
    filename: 'build.js',
    //[name]..这里是webpack提供的根据路口文件自动生成的名字
    publicPath: '/dist/'
    // 公共文件生成的地址
  },
  mode: 'development',
  // 加载器
  module: {
    // 加载器,loaders
    rules: [
      // 编译css
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      //.scss 编译
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      },
      // 解析.vue文件
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
            sass: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
          }
        }
      },
      // 转化ES6的语法
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [['env', { modules: false }], 'stage-0']
        }
      },
      // 图片转化，
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    // 别名，可以直接使用别名来代表设定的路径以及其他
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      filter: path.join(__dirname, './src/filters'),
      components: path.join(__dirname, './src/components')
    },
    // require时省略的扩展名，如：require('module') 不需要module.js
    extensions: ['*', '.js', '.vue', '.json']
  },
  // 服务器配置相关，自动刷新!
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    inline: true,
    progress: true
  },
  performance: {
    hints: false
  },
  // 开启source-map，webpack有多种source-map，在官网文档可以查到
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  ;(module.exports.mode = 'production'), (module.exports.devtool = '#source-map')
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
