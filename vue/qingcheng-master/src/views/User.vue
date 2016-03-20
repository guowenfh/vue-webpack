<template>
<div class="user-view">
  <div class="header">
    <div class="header__cover cover">
      <div class="cover__text">
        <div class="item-container container" v-if="user.username">
          <span class="avatar">
              <avatar :alt="user.username" :src="user.avatar_url" class="v-avatar--squared"></avatar>
          </span>
          <div class="item-content">
            <h2>{{ name }}</h2>
            <p v-html="user.description|urlize"></p>
          </div>
        </div>
      </div>
    </div>
    <div class="header__bottom">
      <div class="container">
        <nav class="header__nav nav">
          <a class="nav__item" v-link="'/u/' + username">Topics</a>
        </nav>
      </div>
    </div>
  </div>
  <router-view :user="user"></router-view>
</div>
</template>

<script>
import api from '../api';
import Avatar from '../components/Avatar.vue';

export default {
  data() {
    return {
      cursor: 0,
      user: {}
    }
  },
  computed: {
    name() {
      return this.user.name || this.user.username;
    },
    username() {
      return this.$route.params.username;
    },
    isOwn() {
      return this.$root.user.username == this.username;
    }
  },
  route: {
    data(transition) {
      var username = transition.to.params.username;
      document.title = this.$site.name + ' — ' + username;
      api.user.profile(username, resp => {
        transition.next({user: resp});
      });
    }
  },
  components: {
    Avatar
  }
};
</script>
