<script>
    export default {
        el: "#app",
        data() {
            return {
                name: "guowenfh",
                age: "21"
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
<style>
    $qwe:#098;
    body {
        background-color: $qwe;
        h1{
            background-color: #eee;
            color: red;
            transform: translate(10%, 10%);
        }

        h1:hover {
            height: 100px;
        }

        h2 {
            background-color: #999;
        }
    }
</style>
