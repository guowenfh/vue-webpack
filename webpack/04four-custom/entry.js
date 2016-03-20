document.getElementById('app').innerHTML="这是我第一个打包成功的程序";
// var h2= document.createElement("h2");
// h2.innerHTML=require("./first.js");

// document.body.appendChild(h2);
// require("./first.js");


//require("!style!css!./style.css");
require("./style.css");

// require("./vue.min.js");
require('expose?Vue!VUE');
// import Vue form ("VUE")
    new Vue({
        el: "body",
        data: {
            message: "hello Vue.js 实现热更新！！对了吧！！"
        }
    });
