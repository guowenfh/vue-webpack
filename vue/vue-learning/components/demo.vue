<!-- components/user.vue -->
<template>
  <p>Hello {{ name }}</p>
  <button @click="alertName()">alert!</button>
</template>

<script>
  module.exports = {
    data: function(){
      return {
        name: 'Randy'
      }
    },
    methods: {
      alertName: function(){
        alert(this.name);
      }
    }
  }
</script>

<style>
  p{
    color: #69C;
  }
</style>
