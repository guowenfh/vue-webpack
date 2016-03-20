<template>
  <div class="logo">
    <div><span class="left-yellow"></span><span class="right-green"></span></div>
    <div><span class="full-green"></span></div>
    <div><span class="left-green"></span><span class="right-red"></span></div>
  </div>
</template>
<style>
  .logo {
    position: relative;
    width: 46px;
    line-height: 1;
  }
  .logo .logo-status {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    text-align: center;
    font-size: 12px;
    line-height: 40px;
    color: #666;
  }
  .logo div {
    line-height: 1;
    height: 12px;
    margin-bottom: 4px;
  }
  .logo div:nth-of-type(2) {
    height: 8px;
  }
  .logo span {
    display: inline-block;
    vertical-align: top;
    height: 100%;
  }
  .logo .left-yellow {
    width: 24px;
    margin-right: 2px;
    background-color: #FFDC00;
    border-radius: 6px 0 0 6px;
  }
  .logo .right-green {
    width: 16px;
    background-color: #42B983;
    border-radius: 0 6px 6px 0;
  }
  .logo .full-green {
    width: 42px;
    background-color: #42B983;
    border-radius: 4px;
  }
  .logo .left-green {
    width: 18px;
    margin-right: 2px;
    background-color: #42B983;
    border-radius: 6px 0 0 6px;
  }
  .logo .right-red {
    width: 22px;
    background-color: #FF4444;
    border-radius: 0 6px 6px 0;
  }

  @keyframes loading {
    0% {
      opacity: 0.2;
    }
    65% {
      opacity: 1;
    }
    100% {
      opacity: 0.1;
    }
  }
  .logo--loading.logo span {
    opacity: 0.2;
    animation: loading 1.8s cubic-bezier(.2,.68,.18,1.08) infinite;
    animation-fill-mode: both;
  }
  .logo--loading.logo .right-green {
    animation-delay: .2s;
  }
  .logo--loading.logo .full-green {
    animation-delay: .4s;
  }
  .logo--loading.logo .left-green {
    animation-delay: .6s;
  }
  .logo--loading.logo .right-red {
    animation-delay: .8s;
  }
  .logo--loading.center {
    margin: 100px auto;
  }
</style>
