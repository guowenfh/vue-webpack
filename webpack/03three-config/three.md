在上面我们已经尝试过了两种对于loader的使用方式，无论是在`require`的时候编写我们loader的前缀，还是在我们的命令行中进根据扩展名来自动绑定我们的loader，显然都不够自动化，在需要编译的语言增加的情况下，显然会是一个噩梦。

所以webapck实际上为我们提供了一个简单的方法：Webpack在执行的时候，除了在命令行传入参数，还可以通过指定的配置文件来执行。默认情况下，会搜索当前目录的`webpack.config.js`文件，这个文件是一个 node.js 模块，返回一个 json 格式的配置信息对象，或者通过 --config 选项来指定配置文件。

所以现在我们就来新建一个`webpack.config.js`，在里面填写进下面的内容：

```js
module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            }
        ]
    }
}
```

我们现在仅仅需要运行:`webpack`如果你的配置没有问题的话，可以在命令行中看到正确的输出，因为这个命令会自动在当前目录镇中查找`webpack.config.js`的配置文件，去修改我们的css吧，感受一下它的便利。

上面我们仅仅是使用了这个配置文件，我们肯定想在实际的工作环境中，自我对于项目进行针对性的配置。下面我们就来学习一下里面参数的详细意义。


- entry：指定打包的入口文件，每有一个键值对，就是一个入口文件
- output：配置打包结果，path定义了输出的文件夹，filename则定义了打包结果文件的名称
- module：定义了对模块的处理逻辑，这里可以用loaders定义了一系列的加载器，以及一些正则。当需要加载的文件匹配test的正则时，就会调用后面的loader对文件进行处理，这正是webpack强大的原因。

在这里仅仅能做一些很简单的介绍，如果想要正则做到在项目中的实际应用，还需要大量的练习与尝试。所以深入的研究在此并不做过多的探究，

下面就来看看webpack中的插件：

插件可以完成更多loader不能完成的功能。
插件的使用一般是在webpack的配置信息plugins 选项中指定。
Webpack本身内置了一些常用的插件，还可以通过npm安装第三方插件。
接下来，我们来看一个最简单的用来给输出的文件头部添加注释信息`BannerPlugin`内置插件来实践插件的配置和运行。

修改 webpack.config.js，添加 plugins配置项：

```
var Webpack = require("webpack");//必须引入

plugins: [
    new webpack.BannerPlugin("这里是打包文件头部注释！")
]
```

运行正确的话应该是这样的，开打`bundle.js`

```
/*! 这里是打包文件头部注释 */
/******/ (function(modules) { //
```

最简单的插件使用方式就是这样的了，下面我们来看一些别的功能。
