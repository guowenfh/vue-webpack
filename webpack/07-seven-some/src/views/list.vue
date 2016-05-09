<script>
    export default{
        data () {
            return {
                peoples:[{
                    name: "小红",
                    age:20
                }, {
                    name: "张三",
                    age: 12
                }, {
                    name: "三五",
                    age: 78
                },  {
                    name: "阿文",
                    age: 22
                }, {
                    name: "李六",
                    age: 78
                }, ]
            }
        }

    }
</script>
<template>
<ul>
    <li v-for="person in peoples">
        {{person.name}} : {{person.age}}
    </li>
</ul>
</template>
<style >
li{
    height: 30px;
    line-height: 30px;
    list-style: none;

}
</style>
