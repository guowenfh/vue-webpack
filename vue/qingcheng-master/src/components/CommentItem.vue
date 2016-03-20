<template>
  <li id="c-{{ comment.id }}" class="comment-item item-container" v-show="comment.id" transition="fade" :class="{'comment-hide': isHide}">
    <span class="avatar">
        <avatar :alt="user.username" :src="user.avatar_url" class="v-avatar--squared"></avatar>
    </span>
    <div class="comment-main item-content">
      <div class="comment-info">
        <a href="/u/{{user.username}}">{{user.username}}</a>
        <time datetime="{{ comment.created_at }}">{{ comment.created_at | timeago }}</time>
        #{{ comment.id }}
        <div class="comment-actions">
          <span v-show="comment.like_count">{{ comment.like_count }} likes</span>
          <a role="button" href="javascript:;" v-if="!isOwner" @click="reply(user.username)" aria-label="reply {{ user.username }}">Reply</a>
          <a class="tip tip-west like-comment" role="button" href="javascript:;" aria-label="like this comment"
          v-if="!isOwner" @click="toggleLike" :class="{liked: comment.liked_by_me}">
            <i class="qc-icon-heart"></i>
          </a>
          <a role="button" href="javascript:;" v-if="!isOwner" @click="flagComment" aria-label="report spam"><i class="qc-icon-flag"></i></a>
          <a role="button" href="javascript:;" v-if="isOwner" @click="deleteComment" aria-label="delete comment"><i class="qc-icon-bin"></i></a>
        </div>
      </div>
      <div class="comment-content" v-html="content"></div>
    </div>
  </li>
</template>

<script>
import api from '../api';
import Avatar from './Avatar.vue'

export default {
  replace: true,
  props: ['comment'],
  computed: {
    user() {
      return this.comment.user;
    },
    isOwner() {
      return this.$root.user.id === this.user.id;
    },
    isHide() {
      return this.comment.flag_count > 5;
    },
    content() {
      var content = this.comment.content;
      // > is for end of the tag: `<p>`
      content = content.replace(/(>|\s)@([0-9a-z]+)/g, '$1<a href="/u/$2">@$2<\/a>');
      return content;
    }
  },
  methods: {
    deleteComment() {
      if (confirm('Are you sure to delete this comment?')) {
        api.comment.delete(this.comment, () => {
          this.comment.id = null;
          this.$parent.topic.comment_count -= 1;
        });
      }
    },
    flagComment() {
      if (confirm('Are you sure to report this comment?')) {
        api.comment.flag(this.comment)
      }
    },
    reply(username) {
      this.$dispatch('reply-comment', username)
    },
    toggleLike() {
      var comment = this.comment;
      if (comment.liked_by_me) {
        api.comment.unlike(comment, resp => {
          comment.liked_by_me = false;
          comment.like_count -= 1;
        });
      } else {
        api.comment.like(comment, resp => {
          comment.liked_by_me = true;
          comment.like_count += 1;
        });
      }
    },
  },
  components: {
    Avatar
  }
}
</script>

<style>
  .comment-item {
    color: #565655;
    padding-top: 14px;
    padding-bottom: 10px;
    list-style-type: none;
  }
  .comment-item .comment-info {
    position: relative;
    font-size: 13px;
    color: #999;
    margin-bottom: 10px;
    line-height: 1;
  }
  .comment-item .comment-actions {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 13px;
    transition: all .2s ease;
  }
  .comment-actions [role=button] {
    color: #999;
    cursor: pointer;
  }
  .comment-actions a {
    opacity: 0.2;
  }
  .comment-actions .like-comment {
    opacity: 0.6;
    margin: 0 1em 0 0.5em;
  }
  .comment-actions .liked {
    color: #FF4444;
  }
  .comment-actions a:hover {
    opacity: 1;
  }
  .comment-item .comment-content {
    line-height: 1.4;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .comment-content p {
    margin: 10px 0;
  }
  .comment-content img {
    max-width: 100%;
  }
  .comment-content blockquote {
    margin: 0 0 1.64em 0;
    border-left: 3px solid #dadada;
    padding-left: 12px;
    color: #666664;
  }
  .comment-content pre {
    margin: 1.64em 0;
    padding: 7px;
    border: none;
    border-left: 3px solid #dadada;
    padding-left: 10px;
    overflow: auto;
    line-height: 1.5;
    font-size: 0.96em;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    color: #4c4c4c;
    background-color: #f9f9f7;
  }
  .comment-hide {
    opacity: 0.2;
  }
  .comment-hide .comment-content {
    font-size: 14px;
  }
</style>
