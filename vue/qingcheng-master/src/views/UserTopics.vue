<template>
  <div class="body">
    <div class="split-view container">
      <div class="main-view">
        <div class="topic-list">
          <ul>
            <template v-for="topic in topics" track-by="id">
              <topic-item :topic="topic"></topic-item>
            </template>
          </ul>
          <logo class="logo--loading center" v-if="$loadingRouteData || loading"></logo>
          <div class="load-more" v-if="cursor" @click="fetchTopics(cursor)">
            Load More
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import TopicItem from '../components/TopicItem.vue';
import Logo from '../components/Logo.vue';

export default {
  props: ['user'],
  data() {
    return {
      loading: false,
      cursor: 0,
      topics: []
    }
  },
  methods: {
    fetchTopics(cursor) {
      this.loading = true;
      api.user.topics(this.$route.params.username, cursor, resp => {
        this.cursor = resp.cursor;
        this.topics = this.topics.concat(resp.data);
        this.loading = false;
      });
    },
  },
  route: {
    data(transition) {
      var params = transition.to.params;
      api.user.topics(params.username, 0, resp => {
        transition.next({
          cursor: resp.cursor,
          topics: resp.data,
        });
      });
    }
  },
  components: {
    TopicItem,
    Logo
  }
}
</script>
