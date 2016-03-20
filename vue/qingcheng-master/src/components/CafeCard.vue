<template>
  <div id="c-{{ cafe.slug }}" class="cafe-card card">
    <a class="cover" :style="color" v-link="link">
      <div class="cover__text">
        <h3 class="card-title">{{ cafe.name }}</h3>
      </div>
    </a>
    <a class="avatar" href="/u/{{ cafe.user.username }}">
        <avatar :alt="cafe.user.username" :src="cafe.user.avatar_url"  size="36" class="tip" v-if="cafe.user"></avatar>
    </a>
    <div class="card-footer">
      <div class="card-description" v-html="description|urlize"></div>
    </div>
  </div>
</template>

<script>
import Avatar from './Avatar.vue'
export default {
  replace: true,
  props: ['cafe', 'subpath'],
  computed: {
    link() {
      var url = '/c/' + this.cafe.slug;
      if (this.subpath) url += this.subpath;
      return url;
    },
    color() {
      var style = this.cafe.style;
      var rv = {};
      if (style.color) {
        rv['background-color'] = style.color;
      }
      if (style.cover) {
        rv['background-image'] = 'url(' + style.cover + ')';
      }
      return rv;
    },
    description() {
      return this.cafe.description || 'No description'
    }
  },
  components: {
    Avatar
  }
}
</script>

<style>
.cafe-card {
  position: relative;
  width: 300px;
}
.cafe-card .avatar {
  position: absolute;
  top: 10px;
  right: 10px;
}
.cafe-card .cover {
  height: 120px;
}
@media (max-width: 480px) {
  .cafe-card {
    width: 100%;
  }
}
</style>
