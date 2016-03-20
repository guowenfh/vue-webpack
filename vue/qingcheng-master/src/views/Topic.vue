<template>
<div class="body">
  <div class="entry-view">
    <hentry v-if="!$loadingRouteData" :topic="topic"></hentry>
    <logo class="logo--loading center" v-if="$loadingRouteData"></logo>
  </div>
  <div class="entry-view comment-box" v-show="topic.id">
    <div class="container">
      <comment-form v-if="topic.id" :topic="topic"></comment-form>
      <div class="comment-list-header" v-if="comments.length">{{ topic.comment_count }} responses</div>
      <ul v-if="comments.length">
        <template v-for="comment in comments" track-by="id">
          <comment-item :comment="comment"></comment-item>
        </template>
        <li class="load-more" v-if="cursor" @click="fetchComments(cursor)">Load More</li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import api from '../api';
import Logo from '../components/Logo.vue';
import CommentForm from '../components/CommentForm.vue';
import CommentItem from '../components/CommentItem.vue';
import Hentry from '../components/Hentry.vue';

export default {
  data() {
    return {
      topic: {},
      comments: [],
      cursor: 0,
    };
  },
  route: {
    data(transition) {
      var id = transition.to.params.topicId;
      this.fetchComments(0);
      api.topic.view(id, resp => {
        document.title = this.$site.name + ' — ' + resp.title;
        transition.next({topic: resp});
      });
    }
  },
  methods: {
    fetchComments(cursor) {
      var id = this.$route.params.topicId;
      api.topic.comments(id, cursor, resp => {
        this.comments = this.comments.concat(resp.data);
        this.cursor = resp.cursor;

        var count = this.topic.comment_count;
        if (count && this.comments.length === count) {
          this.cursor = 0;
        }
      });
    }
  },
  components: {
    Hentry,
    Logo,
    CommentForm,
    CommentItem
  },
  events: {
    'reply-comment': username => {
      if (this.$root.user.id) {
        this.$broadcast('comment-at-user', username)
      } else {
        this.$root.showLogin = true
      }
    }
  }
};
</script>

<style>
  .entry-view .container {
    max-width: 680px;
  }
  .comment-box {
    padding-bottom: 40px;
  }
  .comment-box ul {
    margin: 0;
    padding: 0;
  }
  .comment-list-header {
    line-height: 1;
    color: #666;
    padding: 20px 0 6px;
    border-bottom: 1px solid #eee;
    text-transform: uppercase;
    font-size: 13px;
  }
</style>
