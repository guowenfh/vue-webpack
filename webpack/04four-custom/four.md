现在来我们来试试加载图片，首先第一件事情，肯定是安装对应的`loader`。它会将样式中引用到的图片转为模块来处理，使用该加载器需要先进行安装：
```
npm install url-loader -D
```
当然你也可以在package.json添加依赖，一样的效果。
现在去我们的

现在我们添加两张图片，一张jpg
，一张png。

然后在我们的`webpack.config.js`中添加这段：
```
loaders: [
    { test: /\.css$/, loader: "style!css" },
    { test: /\.(png|jpg)$/, loader: "url-loade?limit=8192" }   // 添加到这！并且会按照文件大小, 或者转化为 base64, 或者单独作为文件
]
```


在我们的css中添加

```css
/*记得写宽高。。*/
#qwe{
    background-image: url(img/logo.png);

}
#asd{
    background-image: url(img/5.jpg);

}
```

继续运行我`webpack`。如果正确的话，打开我们的浏览器，就可以看到我们正确的图片显示了！

如果不正确，请运行`npm install file-loader -D`，再进行尝试。
如果去我们打包文件中查看，可以看到小于设置的临界值的图片被转化成了base64的编码。


## 在 Webpack 中使用别名
模块别名定义，方便后续直接引用别名，无须多写长长的地址，比如我们现在想要把`./vue.min.js`压缩文件打包.

别名（resolve.alias） 是 Webpack 的一个配置项，它的作用是把用户的一个请求重定向到另一个路径，例如通过修改`webpack.config.js` 配置文件，VUE为别名加入：

例如我们之前不用别名，在`entry.js`中，想要把jquery打包
```
require('vue.min.js');
```
设置别名，就可以修改为
```
require('VUE');
```
两者效果相同

在上节中，我们把需要的vue打包了，但是现在前台页面想要直接用还是不可以的，需要我们把vue暴露出来。
你可能在全局中使用了一个压缩版本的 vue，为了修复你可以安装这个暴露全局加载器
```
npm install expose-loader --D
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

### 热加载

当项目逐渐变大，webpack 的编译时间会变长，可以通过参数让编译的输出内容带有进度和颜色。
```
webpack --progress --colors
```
我们已经把webpack的内容了解了一部分了，那么在生产环境中，我不想每一次进行改变，都去命令行中运行我们的`webpack`的命令，我们应该怎么样实现改变后自动更新呢？

webpack 为我们提供了一个`webpack --watch`，他会启动监听模式。开启监听模式后，没有变化的模块会在编译后缓存到内存中，而不会每次都被重新编译，所以监听模式的整体速度是很快的。

去运行这个命令试试吧！！

可以看到直接就可以运行成功，但是显然不够智能，还需要我们手动去刷新浏览器，（其实用liveload可以hack成自动刷新！）简直不能忍，所以使用`webpack-dev-server`会是一个更好的办法！

它将在 localhost:8080 启动一个 express 静态资源 web 服务器，并且会以监听模式自动运行 webpack，在浏览器打开` http://localhost:8080/` 或 `http://localhost:8080/webpack-dev-server/` 可以浏览项目中的页面和编译后的资源输出，并且通过一个 socket.io 服务实时监听它们的变化并自动刷新页面。

```
# 安装
npm install webpack-dev-server -g

# 运行
webpack-dev-server
```
去试试效果吧！（有可能只在`http://localhost:8080/webpack-dev-server/`才会自动刷新）

下面我们就来试试怎么加载vue的文件！
