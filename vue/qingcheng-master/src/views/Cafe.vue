<template>
  <div class="cafe-view">
  <div class="header">
    <div class="header__cover cover" :style="style">
      <div class="cover__text">
        <div class="container">
          <h2>{{ cafe.name }}</h2>
          <p v-html="cafe.description|urlize"></p>
        </div>
      </div>
    </div>
    <div class="header__bottom">
      <div class="container">
        <nav class="header__nav nav">
          <a class="nav__item" v-link="{name: 'cafe', params: {slug: cafe.slug}}">Topics</a>
          <a class="nav__item" v-link="{name: 'cafe-members', params: {slug: cafe.slug}}">Members</a>
          <a class="nav__item" v-if="cafe.intro" href="/t/{{ cafe.intro }}">Introduction</a>
        </nav>
        <div class="header__button" v-if="showFollowing">
          <button class="follow-button button" :class="{'following-button': isFollowing}" @click="toggleFollow">
            <span class="follow-fg">
              <i class="qc-icon-star-empty"></i>
              Follow
            </span>
            <span class="unfollow-fg">
              <i class="qc-icon-star-full"></i>
              Following
            </span>
            <span class="unfollow-bg">Unfollow</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <router-view :cafe="cafe"></router-view>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    var slug = this.$route.params.slug;
    return {
      isFollowing: false,
      cafe: {slug: slug}
    };
  },
  route: {
    data(transition) {
      var slug = transition.to.params.slug;
      api.cafe.view(slug, resp => {
        document.title = this.$site.name + ' — ' + resp.name;
        transition.next({
          cafe: resp,
          isFollowing: resp.is_following
        });
      });
    }
  },
  computed: {
    showFollowing() {
      return this.cafe.id && this.$root.user.id;
    },
    style() {
      var style = this.cafe.style;
      if (!style || !style.cover) return {};
      return {'background-image': 'url(' + style.cover + ')'};
    },
    params() {
      return this.$route.params;
    }
  },
  methods: {
    follow() {
      this.loading = true;
      api.cafe.join(this.cafe.slug, () => {
        this.isFollowing = true;
        this.loading = false;
      });
    },
    unfollow() {
      this.loading = true;
      api.cafe.leave(this.cafe.slug, () => {
        this.isFollowing = false;
        this.loading = false;
      });
    },
    toggleFollow() {
      if (this.loading) return;

      if (this.isFollowing) {
        this.unfollow();
      } else {
        this.follow();
      }
    }
  }
};
</script>

<style>
.follow-button {
  min-width: 10em;
  transition: background-color .2s ease;
}
.unfollow-bg, .unfollow-fg {
  display: none;
}
.following-button .follow-fg {
  display: none;
}
.following-button .unfollow-fg {
  display: inline;
}
.following-button:hover {
  background-color: #FF4444;
}
.following-button:hover .unfollow-bg {
  display: inline;
}
.following-button:hover .unfollow-fg {
  display: none;
}
</style>
