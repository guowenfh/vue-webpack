<template>
  <div class="notification-list">
    <h2>Notifications</h2>
    <div v-for="notice in notifications" class="item-container">
      <avatar :alt="notice.sender.username" :src="notice.sender.avatar_url"></avatar>
      <div class="item-content">
        <div class="item-info">{{ notice.category|message }}</div>
        <a class="topic-title" href="/t/{{notice.topic.id}}">{{notice.topic.title}}</a>
      </div>
    </div>
    <div class="clear-button">
      <button class="button buttong--green" @click="clear">Clear</button>
    </div>
  </div>
</template>

<script>
import api from '../api';
import Avatar from './Avatar.vue'

export default {
  data() {
    return {
      notifications: [],
      pagination: {}
    };
  },
  filters: {
    message(t) {
      var categories = {
        comment: 'commented on your topic',
        like_comment: 'liked your comment',
        like_topic: 'liked your topic',
        mention: 'mentioned you on topic',
      };
      return categories[t] || t;
    }
  },
  methods: {
    fetch() {
      api.notification.list(resp => {
        this.notifications = resp.data;
        this.pagination = resp.pagination;
      });
    },
    hide() {
      this.$root.showNotifications = false;
    },
    clear() {
      api.notification.flush();
      this.hide();
      this.$root.notificationCount = 0;
    }
  },
  ready() {
    this.fetch();
  },
  components: {
    Avatar
  }
};
</script>

<style>
.notification-list {
  padding-top: 50px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}
.notification-list h2 {
  color: #666;
}
.notification-list .item-container {
  margin-bottom: 1em;
  padding-bottom: 1em;
}
.notification-list .item-info {
  color: #999;
  line-height: 1;
  font-size: 14px;
  margin-bottom: 6px;
}
.notification-list .clear-button {
  padding: 30px 0;
  text-align: center;
}
</style>
