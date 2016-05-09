<template>
    <div>
        <h1>姓名{{name}}</h1>
        <h2>这里是年龄啊： {{age}}</h2>
    </div>
</template>
<script>
export default {
    data() {
        return {
            name: "guowenfh",
            age: "21"
        }
    }, methods: {
        golist() {
            this.$route.router.go({
                name: "list"
            });
        }
    }
}
</script>

<style lang="sass">
$qwe:#2DD8AD;
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
