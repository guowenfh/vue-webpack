在上面的我们已经成功的使用了`webpack entry.js bundle.js`进行了我们的文件打包，`webpack`本身只能处理`javascript`的模块。
但是当然它如果能做的仅仅是这样，那它也就不可能这么火了。所以它可以通过引入其他的`loader`，进而可以处理其它类型的文件。

`Loader`可以理解为是模块和资源的转换器，它本身是一个函数，接受源文件作为参数，返回转换的结果。这样，我们就可以通过require来加载任何类型的模块或文件，比如`VUE`、`JSX`、`SASS` 或图片。

更多的特性在这里不进行过多的讲解，相信你应该能在网络中找到介绍。继续学习吧。


现在我们就来添加一个css文件。`style.css`,在里面添加

```css
body {
    background: red;
}
```
修改我们的`entry.js`，添加`require("!style!css!./style.css");`,用来引入我们的css文件。
当然就这样打包运行是肯定不行的，所以我们安装用来读取css文件的`css-loader`，再用 style-loader 把它插入到页面中。

```
npm install css-loader style-loader --save-dev
```
当然你可以用一个更加方便的方式进行安装，在`package.json`中配置它的文件主要是下面这里：
```
  "devDependencies": {
    "css-loader": "^0.23.1",
    "style-loader": "^0.13.0",
    "webpack": "^1.12.2"
  }
```
只需要在这里添加相应的依赖后，然后运行`npm intall`，它会自动帮我们安装。


安装完毕。

我们继续打包`webpack entry.js bundle.js`，完成后刷新我们的页面，背景颜色是不是已经变成了红色了呢？

这就是我们的`loader`的使用方式了。如果每次 require CSS 文件的时候都要写 loader 前缀`!style!css!`这样的东西，显然是一件没麻烦的事情。我们可以根据模块类型（扩展名）来自动绑定需要的 loader。

来看看更简便的方式，将 entry.js 中的 `require("!style!css!./style.css") `修改为` require("./style.css") `，可以改变一个背景颜色让你更明显的查看到变化！然后执行：

```
$ webpack entry.js bundle.js --module-bind "css=style!css"
```
。。

。。。


没成功对吧，，
因为`!`在命令行中具有特殊的含义，所以我们需要对它进行转义操作。再来试试：
```
 webpack ./entry.js bundle.js --module-bind "css=style\!css"
```

成功的话，应该能再次看到背景的变化。

但是你说我不想每次都运行那么一长串的命令怎么办？继续往下走
