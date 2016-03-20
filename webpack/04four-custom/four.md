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
然后像下面这样修改entry.js：
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
