<template>
    <router-view></router-view>
    {{msg}}
</template>
<script>
    export default {
        replace: false,
        //props: ['父组建传的值'],
        data: function() {
            return {
                msg: '这里返回数据'
            }
        }
    }
</script>
<style>
    *,
    *:before,
    *:after {
        box-sizing: border-box;
    }
</style>
