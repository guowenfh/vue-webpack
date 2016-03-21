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
<div>
    <h1>姓名：{{name}}</h1>
    <h2>{{age}}</h2>
</div>
</template>

<style lang="sass">
    $qwe:blue;
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
