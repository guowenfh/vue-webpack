<script>
    export default{
        data () {
           return {
                hello:"这里是嵌套路由！！！1"
            }
        }
    }
</script>

<template>
    <div>
        <h3>{{hello}}</h3>
        <h4>{{hello}}</h4>
    </div>

</template>

<style scoped>
    div{
        text-shadow: 1px 1px 10px #000;
    }
</style>
