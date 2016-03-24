var Webpack = require("webpack");
module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.(jpg|png)$/,
            loader: 'url-loader?limit=8192&name=./[name].[ext]'
        }]
    },
    plugins: [
        new Webpack.BannerPlugin("这里是打包文件头部注释")
    ],
    // resolve: {
    //     alias: {
    //         VUE: "./vue.min.js"
    //     }
    // }
}
