<script>

    export default {
        data () {
            return {
                name:"guowenfh",
                age:"21"
            }
        }
        ,
        methods :{
            golist (){
                this.$route.router.go({name:"list"});
            }
        }
    }
</script>

<template>
<div>
    <h1>姓名：{{name}}</h1>
    <h2>{{age}}</h2>
    <button @click="golist">走你</button>
    <a v-link="{ name: 'list'}">能不能走！</a>
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
