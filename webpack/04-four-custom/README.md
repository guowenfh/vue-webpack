# webpack入坑之旅（四）扬帆起航

## 加载图片

现在来我们来试试加载图片，首先第一件事情，肯定是安装对应的`loader`。它会将样式中引用到的图片转为模块来处理，使用该加载器需要先进行安装：

```sh
npm install url-loader --save-dev
```
当然你也可以在`package.json`添加依赖，然后再`npm nstall`一样的效果。

现在去我们的项目目录中添加img文件夹，添加两张图片，一张大图jpg，一张小图png。

然后在我们的`webpack.config.js`中添加这段：

```js
loaders: [
    { test: /\.css$/, loader: "style!css" },
    { test: /\.(png|jpg)$/, loader: "url-loader?limit=8192" }   // 添加到这！并且会按照文件大小, 或者转化为 base64, 或者单独作为文件
    //在大小限制后可以加上&name=./[name].[ext]，会将我们的文件生成在设定的文件夹下。
]
```
在html中添加：

```html
<img src="img/logo.png" alt="">
<div id="qwe"></div>
<div id="asd"></div>
```

在我们的css中添加：

```css
/*记得写宽高。。*/
#qwe{
    background-image: url(img/logo.png);/*3.2k*/
}
#asd{
    background-image: url(img/5.jpg);
}
```

继续运行`webpack`如果正确的话，打开我们的浏览器，就可以看到我们正确的图片显示。

如果不正确，请运行`npm install file-loader -D`，再进行尝试。

现在我们打开浏览器的调试工具，可以看到小于8K的 **背景图片** 图片已经被转化成了base64的编码，而大于8k的图片则并没有转化（**注意它的地址的变化！**）。
直接使用img导入的图也并没有进行base64的转化。


### 热加载



当项目逐渐变大，`webpack `的编译时间会变长，可以通过参数让编译的输出内容带有 **进度** 和 **颜色** 。

```sh
webpack --progress --colors
```
下面还有一些其他常用的命令：

```sh
webpack #最基本的启动webpack命令
webpack -w #提供watch方法，实时进行打包更新
webpack -p #对打包后的文件进行压缩
webpack -d #提供SourceMaps，方便调试
webpack --colors #输出结果带彩色，比如：会用红色显示耗时较长的步骤
webpack --profile #输出性能数据，可以看到每一步的耗时
webpack --display-modules #默认情况下 node_modules 下的模块会被隐藏，加上这个参数可以显示这些被隐藏的模块
```

我们已经把webpack的内容了解了一部分了，那么在生产环境中，我不想每一次进行改变，都去命令行中运行我们的`webpack`的命令，我们应该怎么样实现改变后自动更新呢？

webpack 为我们提供了一个`webpack --watch`，他会启动监听模式。开启监听模式后，没有变化的模块会在编译后缓存到内存中，而不会每次都被重新编译，所以监听模式的整体速度是很快的。

去运行这个命令试试吧！！

在我们改变代码之后，命令行中可以看到直接就自动编译了，但是显然不够智能，还需要我们手动去刷新浏览器，（其实用`liveload`hack成自动刷新！）。


我反正不能忍，还要手动刷新浏览器。所以使用`webpack-dev-server`会是一个更好的办法！

它将在`localhost:8080`启动一个express静态资源web服务器，并且会以监听模式自动运行`webpack`，在浏览器打开`http://localhost:8080/`或 `http://localhost:8080/webpack-dev-server/` 可以浏览项目中的页面和编译后的资源输出，并且通过一个`socket.io`服务实时监听它们的变化并自动刷新页面。

```sh
# 安装
npm install webpack-dev-server -g

# 运行
webpack-dev-server
```


## 试试vue

我们来试试使用vue能配合webpack能不能实现自动刷新。(有关vuejs的知识，大家可以可以先自行上[官网查看](http://cn.vuejs.org/guide/)，我在接下来可能也会一步一步的把vue的例子全部敲一遍，再放到github上来让点评)

首先运行`npm install vue -save`将vue添加到我们的项目依赖中去。

首先在我们的`entry.js`这个入口文件中进行添加：

```js
// import Vue form ("vue") //如果你安装了babel-loader的话，可以直接使用ES6的语法
var Vue =require("vue");
    new Vue({
        el: "body",
        data: {
            message: "hello vue.js"
        }
    });

```

同样在`index.html`中添加`{{ meassge }}`来响应vue的数据绑定。

运行`webpack-dev-server`。去浏览器查看试试效果吧！任意改变`message`中的值，可以看到浏览器会自动刷新。并且将改变的值展示在眼前。（有可能只在`http://localhost:8080/webpack-dev-server/`才会自动刷新）

自动刷新都配好了。下面我们就来试试怎么加载vue的文件，来实现单文件组件！
