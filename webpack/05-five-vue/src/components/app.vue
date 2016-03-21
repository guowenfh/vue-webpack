<script>
    export default {
        el:"#app",
        data () {
            return {
                name:"guowenfh",
                age:"21"
            }
        }
    }
</script>

<template>
<div style="background-color:rgba(0,0,0,0.2)">
    <h1>姓名：{{name}}</h1>
    <h2>{{age}}</h2>
摄动方法
</div>
</template>

<style lang="sass">
    $qwe:red;
    body{
        background-color: $qwe;
    }
    h1{
        background-color: #eee;
        color: red;
    }
    h2{
        background-color: #999;
    }
</style>
