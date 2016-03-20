<template>
  <form class="comment-form" @submit="formSubmit" v-el:form>
    <div class="comment-form-mask" @click="showLogin" v-if="!user.id"></div>
    <avatar :alt="user.username" :src="user.avatar_url" v-if="user.id" class="small circle"></avatar>
    <markdown-area class="comment-item" placeholder="Write your response" :content.sync="comment" @submit="postComment"></markdown-area>
    <button class="button" v-if="user.id">Reply</button>
  </form>
</template>

<script>
import api from '../api';
import shake from '../utils';
import Avatar from './Avatar.vue';
import MarkdownArea from './MarkdownArea.vue';

export default {
  props: ['topic'],
  data() {
    return {
      html: '',
      comment: ''
    };
  },
  computed: {
    user() {
      return this.$root.user;
    },
    count() {
      var num = 480 - this.comment.length;
      if (num < 20) return '<span class="red">' + num + '</span>';
      if (num < 30) return '<span class="yellow">' + num + '</span>';
      if (num < 60) return num;
      return 0;
    }
  },
  methods: {
    formSubmit(e) {
      e && e.preventDefault();
      this.postComment();
    },
    postComment() {
      var content = this.comment.trim();
      if (!content || 480 - content.length < 0) {
        return shake(this.$els.form);
      }

      this.comment = '';
      var payload = {content: content};
      api.comment.create(this.topic.id, payload, resp => {
        this.$parent.comments = [resp].concat(this.$parent.comments);
        this.$parent.topic.comment_count += 1;
      });
    },
    showLogin() {
      this.$root.showLogin = true;
    },
  },
  components: {
    Avatar,
    MarkdownArea
  },
  created () {
    this.$on('comment-at-user', username => {
      if (this.comment === '') {
        this.comment = this.comment + '@' + username + ' '
      } else {
        this.comment = this.comment + ' @' + username + ' '
      }
    })
  }
}
</script>

<style>
  .comment-form {
    position: relative;
    padding-top: 10px;
    padding-bottom: 20px;
  }
  .comment-form .comment-form-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: pointer;
    z-index: 9;
  }
  .comment-form .avatar {
    position: absolute;
    top: 6px;
    left: -48px;
    border-radius: 50%;
  }
  .comment-form textarea {
    width: 100%;
    height: 4.2em;
    padding: 10px 0;
    border: none;
    outline: none;
    color: #565656;
    line-height: 1.4;
    resize: none;
    transition: all 0.15s ease;
  }
  .comment-form textarea:focus, .comment-form textarea.active {
    height: 12.6em;
  }
  .comment-form .comment-form-count {
    margin-left: 14px;
    color: #999;
  }
  .comment-form .comment-form-count .yellow {
    color: #FFDC00;
  }
  .comment-form .comment-form-count .red {
    color: #FF4444;
  }
</style>
