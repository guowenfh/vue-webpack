document.getElementById('app').innerHTML = '这是我第一个打包成功的程序'

require('./style.css')

const Vue = require('vue/dist/vue')
new Vue({
  el: '#main',
  data: {
    message: 'hello vue.js'
  }
})
