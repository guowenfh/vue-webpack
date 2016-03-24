
```javascript
// webpack.config.js
var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: ['style', 'css']
    }]
  }
}
```

## 配置说明：

`entry`：指入口文件的配置项，它是一个数组的原因是webpack允许多个入口点。
当然如果你只有一个入口的话，也可以直接使用双引号`./src/main'`


`npm config set loglevel=http`

打开这个你会看到所有的 HTTP 请求，除此之外如果还有 \ 长时间打转，那就是外部模块的编译过程，一个字：等。`

entry 是指入口文件的配置项，它是一个数组的原因是webpack允许多个入口点。
output是指输出文件的配置项

path － 表示输出文件的路径
filename - 表示输出文件的文件名
plugins 顾名思义，使用插件可以给webpack添加更多的功能，使webpack更加的灵活和强大,webpack有两种类型的插件:

webpack内置的插件

```javascript
// 首先要先安装webpack模块
`var webpack = require("webpack");

module.exports = {
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    })
};`
webpack外置插件
```
比如:

~~//npm install component-webpack-plugin 先要在安装该模版
var ComponentPlugin = require("component-webpack-plugin");
module.exports = {
    plugins: [
        new ComponentPlugin()
    ]
}~~
更多的插件以及插件的用法，大家可以到webpack的插件上查看。

module 配置处理文件的选项

loaders 一个含有wepback中能处理不同文件的加载器的数组

test 用来匹配相对应文件的正则表达式
loaders 告诉webpack要利用哪种加载器来处理test所匹配的文件
loaders 的安装方法

$ npm install xxx-loader --save-dev



## 在 Webpack 中使用别名

当我需要在项目中添加别的js库时，就需要引入该模块。
模块别名定义，方便后续直接引用别名，无须多写长长的地址，比如我们现在想要把`./vue.min.js`压缩文件打包.

别名（resolve.alias） 是Webpack的一个配置项，它的作用是把用户的一个请求重定向到另一个路径，例如通过修改`webpack.config.js` 配置文件，VUE为别名加入：

例如我们之前不用别名，在`entry.js`中，想要把vue打包。`require('vue.min.js');`
设置别名，就可以修改为
```
require('VUE');
```
两者效果相同

在上节中，我们把需要的vue打包了，但是现在前台页面想要直接用还是不可以的，需要我们把vue暴露出来。
你可能在全局中使用了一个压缩版本的 vue，为了修复你可以安装这个暴露全局加载器
```
npm install expose-loader --save-dev
```
然后像下面这样修改entry.js：（还可以用ES6语法，来进行引入，以后再讲）
```
require('expose?Vue!VUE');
new Vue({
    el: "body",
    data: {
        message: "hello Vue.js"
    }
});
//html中添加{{message}}
```
运行`webpack`，可以看到我们的"hello Vue.js"被正确的输出
