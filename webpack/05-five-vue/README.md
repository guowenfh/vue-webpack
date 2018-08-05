# webpack入坑之旅（五）加载vue单文件组件

## 需要什么？

在经过前面的四个练习，相信已经对于`webapck`有了一定的了解，现在我们就来一个综合案例，进一步加深对于`webpack`的理解。

首先我们应该思考要解析`.vue`类型的文件，需要什么样的东西？应该按照什么样的步骤来？我们应该怎么去搭建这个项目？


## 开始

### 第一步：初始化项目目录

我们需要创建如下目录及文件夹，最终目录结构如下：

```js
- dist //文件生成目录
    -- //自动生成
- node_module //自动安装
    -- ...
- src //文件入口
    -- components //组件存放
        -- app.vue //主.vue
    -- main.js //主.js
- index.html //主.html
- package.json //npm 配置
- webpack.cofig.js // webpack配置
```

### 第二步：安装项目依赖

如果你上面没有创建`package.json`文件的话，可以直接使用`npm init`来初始化我们的`package.json`文件的配置。

想要去编译其他的文件比如`react`，`coffce`等等，就必须要加载很多对应的`loader`。要想加载一个`.vue`文件。当然也是同样的道理。
建议用`npm install xxx-loader --save-dev`这样的命令一条一条的敲。在命令行中，会有提示，可以帮助理解`webpack`的中的依赖管理关系。我的配置清单如下：
**在实际项目中，json文件中不能出现注释**，在这里为了方便大家了解里面设置项的含义，就直接使用注释的方式加载后面了。

```js
{
    "name": "05-five-vue", //项目名称
    "version": "1.0.0", //版本
    "description": "vue+webapck", //描述
    "main": "index.js", //主文件
    "scripts": {
        "dev": "cross-env NODE_ENV=development webpack-dev-server --open --hot"
    }, //scripts指定了运行脚本命令的npm命令行缩写，比如这是的start指定了运行npm run start时，所要执行的命令。
    "dependencies": { //项目依赖
        "vue": "^2.5.17"
    },
    // 编译成的 es 版本
    "browserslist": [
        "> 1%",
        "last 2 versions",
        "not ie <= 8"
    ],
    "devDependencies": { //各种各样的loader，用来解析想相应的文件格式。要解析vue并且完成相应的功能，这些基本都是必须的。
        "babel-core": "^6.26.3",
        "babel-loader": "^7.1.5",
        "babel-preset-env": "^1.7.0",
        "babel-preset-stage-0": "^6.24.1",
        "babel-preset-stage-3": "^6.24.1",
        "cross-env": "^5.2.0",
        "css-loader": "^1.0.0",
        "file-loader": "^1.1.11",
        "node-sass": "^4.9.2",
        "sass-loader": "^7.1.0",
        "style-loader": "^0.21.0",
        "url-loader": "^1.0.1",
        "vue-loader": "^14.2.3",
        "vue-style-loader": "^4.1.1",
        "vue-template-compiler": "^2.5.17",
        "webpack": "^4.16.4",
        "webpack-cli": "^3.1.0",
        "webpack-dev-server": "^3.1.5"
    },
    "author": "guowenfh", //作者
    "license": "MIT", //开源协议
    "keywords": [ //关键字
        "vue",
        "webpack"
    ]
}
```

如果你想省事的话，直接复制上面的`devDependencies`,`dependencies`字段，并且填写到你的`package.json`文件中。然后运行`npm install`就会自动安装所有的模块以及依赖。


### 第三步：配置webpack

文件已经设置好了，接下来就到了我们关键的一步，配置`webpack.config.js`,清单如下：


```javascript
const path = require('path')
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
    mode:'development',
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
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ],
              },
              {
                test: /\.sass$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader?indentedSyntax'
                ],
              },
            // 解析.vue文件
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                      'scss': [
                        'vue-style-loader',
                        'css-loader',
                        'sass-loader'
                      ],
                      'sass': [
                        'vue-style-loader',
                        'css-loader',
                        'sass-loader?indentedSyntax'
                      ]
                    }
                }
            },
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options:{
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
        overlay: true
    },
    performance: {
        hints: false
    },
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    devtool: '#eval-source-map'
}

```

请详细查看这里面的设置，我这里都是很简单的配置，在你的项目中，还可以更进一步的对于入口文件和输出文件进行更加深入的定制。

并且在这里生成的css文件还会插到js中，有时我们需要更进一步的把它独立出来，然后在html中引入这时就会用到`webpack`的插件，在这里先不说（因为我暂时没用到，没有试验过，好像也不麻烦，可以的话下篇再试试）

### 第四步：编写代码

接下来就是我们要展示的文件的编写了，我直接把代码贴上来了。

index.html：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>webpack vue</title>
    <style>
        *, *:before, *:after {
            box-sizing: border-box;
        }
        body, html {
            height: 100%;
            overflow: hidden;
        }
        #app {
            margin: 20px auto;
            width: 800px;
            height: 600px;
        }
    </style>
</head>

<body>

    <div id="app"></div>

    <script src="./dist/build.js"></script>
</body>

</html>

```

这里是main.js的内容：

```javascript
//es6语法：
import Vue from "vue";
//引入我们编写的测试用vue文件。
import App from './components/app';

Vue.config.debug = true;//开启错误提示

new Vue({
    el: '#app',
    render: h => h(App)
})

```

这里是app.vue：

```html
<template>
    <div id="app">
        <h1>姓名：{{name}}</h1>
        <h2>{{age}}</h2>
    </div>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {
      name: 'guowenfh',
      age: '23'
    }
  }
}
</script>
<style lang="scss" >
$qwe: #098;
body {
  background-color: $qwe;
  h1 {
    background-color: #eee;
    color: yellowgreen;
    transform: translate(10%, 10%);
  }

  h1:hover {
    height: 100px;
  }

  h2 {
    background-color: #999;
  }
}
</style>

```
### 第五步：修改自动刷新设置

下面再单独的再谈一下关于自动刷新的实现，首先需要说明，在上一篇博客中的自动刷新实现，是有问题的。只能改变css样式，使颜色进行变化。对于html里面的内容改变时，浏览器并不会自动刷新。

**注意点一：**
首先我们看到`package.json`中`scripts`字段中的`"start": "cross-env NODE_ENV=development webpack-dev-server --open --hot"`。 这里开启了 热加载 以及自动打开浏览器。

**注意点二：**
因为我们没有加`--hot`，所以在`webpack.cofig.js`中需要对于`devServer`进行一些配置，如下：

```js
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        inline: true,
        progress: true, // 进度
    },
```

这样安装设置完成之后，就有了自动局部更新了！！

## 结束

步骤都走完了，因为在上面的`package.json`中已经进行了`scripts`项的配置。运行`npm start`，打开`localhost:8080`

可以看到设置的背景色已经出来了,去改变一下背景颜色？data？template？

看看浏览器会不会自动刷新？

---

如果你按照我的步骤，并且，npm包安装没有错误的话，应该就能成功了。

不行的话，请再仔细对照去看看有什么地方没有编写对吧！

