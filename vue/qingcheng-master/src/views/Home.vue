<template>
<div class="home-view">
  <div class="header">
    <div class="header__cover cover">
      <div class="cover__text">
        <div class="container">
          <h2>{{ $site.name }}</h2>
          <p v-html="$site.description|urlize"></p>
        </div>
      </div>
    </div>
    <div class="header__bottom">
      <div class="container">
        <nav class="header__nav nav">
          <a class="nav__item" v-link="'/'">Following</a>
          <a class="nav__item" v-link="'/?show=all'">Topics</a>
          <a class="nav__item" v-link="'/c/'">Cafes</a>
        </nav>
      </div>
    </div>
  </div>

  <div class="body">
    <div class="split-view container">
      <div class="main-view">
        <div class="topic-list">
          <ul>
            <template v-for="topic in topics" track-by="id">
              <topic-item :topic="topic"></topic-item>
            </template>
          </ul>
          <logo class="logo--loading center" v-if="fetching"></logo>
          <div class="load-more" v-if="cursor" @click="fetchTopics(cursor)">
            Load More
          </div>
        </div>
      </div>
      <div class="sidebar-view">
        <div class="widget">
          <a v-link="{path: '/c/?show=create'}" class="button button--green" v-if="$root.user.id">New Topic</a>
        </div>
        <div class="site-sidebar" v-html="sidebar" v-if="sidebar"></div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import api from '../api';
import TopicItem from '../components/TopicItem.vue';
import Logo from '../components/Logo.vue';

var zerqu = window.ZERQU || {};

export default {
  data() {
    return {
      fetching: true,
      cursor: 0,
      sidebar: zerqu.sidebar,
      topics: []
    }
  },
  methods: {
    compile() {
      this.cursor = 0;
      this.topics = [];
      this.fetchTopics();
    },
    fetchTopics(cursor) {
      this.fetching = true;
      var params = this.$route.query || {};
      if (cursor) params.cursor = cursor;
      api.timeline(params, resp => {
        this.cursor = resp.cursor;
        this.topics = this.topics.concat(resp.data);
        this.fetching = false;
      });
    }
  },
  compiled() {
    document.title = this.$site.name;
  },
  route: {
    data(transition) {
      var params = transition.to.query || {};
      api.timeline(params, resp => {
        transition.next({
          cursor: resp.cursor,
          topics: resp.data,
          fetching: false,
        });
      });
    }
  },
  components: {
    Logo,
    TopicItem,
  }
};
</script>
