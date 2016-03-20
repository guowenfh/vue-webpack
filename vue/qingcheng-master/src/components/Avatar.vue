<template>
  <span class="v-avatar" :style="styleSize" :class="{'v-avatar--image': image}" :aria-label="alt">
    <span class="v-avatar__text" v-text="name" :style="{background: bg, color: fg}"></span>
  </span>
</template>

<script>
import wc from "word-color"
var failed = {}

export default {
  props: ['alt', 'src', 'size'],
  data() {
    return {image: false}
  },
  computed: {
    bg() {
      if (!this.alt) {
        return 'black'
      }
      return wc(this.alt)
    },
    fg() {
      if (!this.alt) {
        return 'black'
      }
      var bg = wc.rgb(this.alt)
      if ((bg[0] * 299 + bg[1] * 587 + bg[2] * 144) > 200000) {
        return 'black'
      }
      return 'white'
    },
    name() {
      if (!this.alt) {
        return ''
      }
      return this.alt.charAt(0).toUpperCase()
    },
    styleSize() {
      if (!this.size) return

      var px = this.size + 'px'
      return {
        'width': px,
        'height': px,
        'line-height': px,
        'font-size': this.size / 2 + 'px',
      }
    }
  },
  ready() {
    if (!this.src) return

    // load failed
    var key = 'v-avatar:' + this.src
    if (failed[key]) return

    var img = new Image()
    img.src = this.src
    img.alt = this.alt

    var me = this;
    img.onload = function() {
      me.image = true
      me.$el.appendChild(img)
    }
    img.onerror = function() {
      failed[key] = 1
    }
  }
}
</script>

<style>
.v-avatar {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  font: 300 normal 24px/48px sans-serif;
}
.v-avatar--squared {
  border-radius: 2px;
}
.v-avatar .v-avatar__text {
  display: inline-block;
  width: 100%;
  height: 100%;
  user-select: none;
}
.v-avatar img {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.v-avatar--image .v-avatar__text {
  display: none;
}
</style>
