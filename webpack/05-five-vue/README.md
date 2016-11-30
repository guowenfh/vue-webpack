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
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "webpack-dev-server --inline"
    }, //scripts指定了运行脚本命令的npm命令行缩写，比如这是的start指定了运行npm run start时，所要执行的命令。
    "dependencies": { //项目依赖
        "vue": "^1.0.18"
    },
    "devDependencies": { //各种各样的loader，用来解析想相应的文件格式。要解析vue并且完成相应的功能，这些基本都是必须的。
        "autoprefixer-loader": "^2.0.0",
        "babel": "^6.3.13",
        "babel-core": "^6.3.21",
        "babel-loader": "^6.2.0",
        "babel-plugin-transform-runtime": "^6.3.13",
        "babel-preset-es2015": "^6.3.13",
        "babel-runtime": "^5.8.34",
        "css-loader": "^0.16.0",
        "file-loader": "^0.8.5",
        "html-loader": "^0.3.0",
        "node-sass": "^3.4.2",
        "sass-loader": "^3.2.0",
        "style-loader": "^0.12.3",
        "url-loader": "^0.5.6",
        "vue-html-loader": "^1.2.0",
        "vue-loader": "^7.2.0",
        "webpack": "^1.12.0",
        "webpack-dev-server": "^1.14.0"
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
var path = require('path');
// NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
// 模块导入
module.exports = {
    // 入口文件地址，不需要写完，会自动查找
    entry: './src/main',
    // 输出
    output: {
        path: path.join(__dirname, './dist'),
        // 文件地址，使用绝对路径形式
        filename: '[name].js',
        //[name]这里是webpack提供的根据路口文件自动生成的名字
        publicPath: '/dist/'
        // 公共文件生成的地址
    },
    // 服务器配置相关，自动刷新!
    devServer: {
        historyApiFallback: true,
        hot: false,
        inline: true,
        progress: true,
    },
    // 加载器
    module: {
        // 加载器
        loaders: [
        // 解析.vue文件
            { test: /\.vue$/, loader: 'vue' },
        // 转化ES6的语法
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
        // 编译css并自动添加css前缀
            { test: /\.css$/, loader: 'style!css!autoprefixer'},
        //.scss 文件想要编译，scss就需要这些东西！来编译处理
        //install css-loader style-loader sass-loader node-sass --save-dev
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
        // 图片转化，小于8K自动转化为base64的编码
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'},
        //html模板编译？
            { test: /\.(html|tpl)$/, loader: 'html-loader' },
        ]
    },
    // .vue的配置。需要单独出来配置，其实没什么必要--因为我删了也没保错，不过这里就留这把，因为官网文档里是可以有单独的配置的。
    vue: {
        loaders: {
            css: 'style!css!autoprefixer',
        }
    },
    // 转化成es5的语法
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            filter: path.join(__dirname, './src/filters'),
            components: path.join(__dirname, './src/components')
        }
    },
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    devtool: 'eval-source-map'
};

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
            #app {
                margin: 20px auto;
                width: 800px;
                height: 600px;
            }
        </style>
    </head>

    <body>
        <div id="app"></div>
        <script src="dist/main.js"></script>
    </body>

    </html>
```

这里是main.js的内容：

```javascript
//es6语法：
import Vue from "../node_modules/vue/dist/vue.min.js";//其实不用写完，会自动查找。
//外部引入别的库都可以用这样的方式，比如jquery等。。
//引入我们编写的测试用vue文件。
import app from './components/app';

Vue.config.debug = true;//开启错误提示

new Vue(app);

```

这里是app.vue：

```html
<script>
    //es6
    export default {
        el:"#app",
         //data:function(){}，下面是es6写法
         data () {
            return {
                name:"guowenfh",
                age:"2q1"
            }
        }
    }
</script>
<template>
    <div>
        <h1>姓名：{{name}}</h1>
        <h2>{{age}}</h2>
    </div>
</template>
<style lang="sass">
    /*一定要加lang不然无法编译*/
    /*测试一下对sass的编译*/
    $qwe:#098;
    body{
        background-color: $qwe;
        h1{
            background-color: #eee;
            color: red;
            transform: translate(10%, 10%);/*测试自动添加前缀*/
        }
        h1:hover{
            height:100px;
        }

        h2{
            background-color: #999;
        }
    }
</style>

```
### 第五步：修改自动刷新设置

下面再单独的再谈一下关于自动刷新的实现，首先需要说明，在上一篇博客中的自动刷新实现，是有问题的。只能改变css样式，使颜色进行变化。对于html里面的内容改变时，浏览器并不会自动刷新。

**注意点一：**
首先我们看到`package.json`中`scripts`字段中的`"start": "webpack-dev-server --inline"`。这里如果按照网上的方法在后面再添加上`--hot`的话，只会对于`app.vue`中的`<style>`标签内的css起效果。

**注意点二：**
因为我们没有加`--hot`，所以在`webpack.cofig.js`中需要对于`devServer`进行一些配置，如下：（主要是是`hot`设置为了false）。

```js
devServer: {
    historyApiFallback: true,
    hot: false,
    inline: true,
    progress: true,
}
```
这样设置了之后按下保存相当于按下了F5浏览器整个刷新。而不是局部刷新。（如果你实现了局部刷新，并且没有其他问题，那请教教我^_^）

**注意点三：**

注意`package.json`的loader安装中的`"vue-hot-reload-api": "^1.2.2"`。它有可能是导致你不能自动刷新的凶手(我现在都没搞明白到底该安装，还是取消)

## 结束

步骤都走完了，因为在上面的`package.json`中已经进行了`scripts`项的配置。运行`npm start`，打开`localhost:8080`

可以看到设置的背景色已经出来了,去改变一下背景颜色？data？template？

看看浏览器会不会自动刷新？

---

如果你按照我的步骤，并且，npm包安装没有错误的话，应该就能成功了。

不行的话，请再仔细对照去看看有什么地方没有编写对吧！

