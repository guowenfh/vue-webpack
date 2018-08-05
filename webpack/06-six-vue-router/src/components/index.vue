<script>
import hello from './hello.vue'
export default {
  data() {
    return {
      name: 'guowenfh',
      age: '21'
    }
  },

  methods: {
    golist() {
      this.$router.push({ path: '/list' })
    }
  }
  // components:{
  //     hello
  // }
}
</script>

<template>
    <div>
        <h1>姓名：{{name}}</h1>
        <h2>{{age}}</h2>
        <button @click="golist">$route.push查看</button>
        <router-link :to="{ path: '/list' }">v-link查看列表</router-link>
        <router-link :to="{ path: '/index' }">回去主页</router-link>
        <router-link :to="{ path: '/index/hello' }">嵌套的路由</router-link>
        <hello></hello>
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
$qwe: gray;
body {
  background-color: $qwe;
  color: red;
}
h1 {
  background-color: blue;
  color: red;
}
h2 {
  background-color: purple;
}
a {
  font-size: 34px;
  color: black;
}
</style>
