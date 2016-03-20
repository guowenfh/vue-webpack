安装：

前提：首先确保你的电脑里面已经安装了node，以及npm！，若是版本问题，直接更新版本即可。本博客使用node：v5.8.0  ，npm：3.7.3

要在你项目下安装webpack，首先就需要进行全局的安装，运行如下命令：`npm install webpack -g`，可能需要一点时间。

安装成功后，在命令行输入`webpack -h`即可查看版本信息。以及一些指令。

当然 大部分时间我们都应该将webapck安装到当前的项目依赖中，此时就可以使用项目的本这样就可以使用项目本地版本的 Webpack。

```
## 确保已经进入项目目录
## 确定已经有 package.json，没有就通过 npm init 创建
## 安装 webpack 依赖

npm install webpack --save-dev
## 缩写形式
npm i webpack -D
```

还有一个webpack的开发工具，可供选择，支持浏览器实时刷新：
`npm install webpack-dev-server --save-dev`


既然环境都已经安装好了，那么我们就开始来用webpack进行我们的第一个打包运行程序吧！

首先创建一个静态页面 `index.html` 和一个 JS 入口文件 `entry.js`,（这里你想用什么名字都可以，只需要在打包的时候读取文件为该名字就好，不过，到时候就知道这个名字的含义啦！）：
```
<!-- index.html -->
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <h1 id="app"></h1>
    <script src="bundle.js"></script>
</body>
</html>
```

```
entry.js
document.getElementById('app').innerHTML="这是我第一个打包成功的程序";
```

文件都已经创建成功了，那么就开始我们的打包吧！

`webpack entry.js bundle.js`


在浏览器中打开`index.html`，就能看到我们设置的文字啦！


我们再来增加一个文件，`first.js`内容如下：

```
var h2= document.createElement("h2")
h2.innerHTML="不是吧，那么快第二个打包程序啦！";
document.body.appendChild(h2);
```

更改  `entry.js`:

```
//添加
require("./first.js");
```

再进行一次打包`webpack entry.js bundle.js`，刷新浏览器，可以发现我们的刚刚的代码已经生效，又有了新的文字出现

