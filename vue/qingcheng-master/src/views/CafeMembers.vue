<template>
  <div class="body members">
    <div class="section container" v-if="admins.length">
      <h2 class="section-title">Moderators</h2>
      <ul>
        <li v-for="user in admins">
          <avatar :alt="user.username" :src="user.avatar_url"></avatar>
          <div class="member-info">
            <a href="/u/{{ user.username }}">{{ user.username }}</a>
            <p v-html="user.description|urlize"></p>
          </div>
        </li>
      </ul>
    </div>
    <div class="section container" v-if="members.length">
      <h2 class="section-title">Members</h2>
      <ul>
        <li v-for="member in members">
          <avatar :alt="member.user.username" :src="member.user.avatar_url"></avatar>
          <div class="member-info">
            <a href="/u/{{ member.user.username }}">{{ member.user.username }}</a>
            <div>{{ member.label }} at <time datetime="{{ member.created_at }}">{{ member.created_at|timeago }}</time></div>
          </div>
        </li>
      </ul>
    </div>
    <logo class="logo--loading center" v-if="!admins.length"></logo>
  </div>
</template>

<script>
import api from '../api';
import Logo from '../components/Logo.vue';
import Avatar from '../components/Avatar.vue';

export default {
  props: ['cafe'],
  data() {
    return {
      pagination: {},
      admins: [],
      members: []
    }
  },
  route: {
    data: function(transition) {
      var params = transition.to.params;
      api.cafe.users(params.slug, params.page, resp => {
        transition.next({
            pagination: resp.pagination,
            admins: resp.admins,
            members: resp.data,
        });
      });
    }
  },
  components: {
    Avatar,
    Logo
  }
}
</script>

<style>
  .members .section {
    padding-top: 10px;
    padding-bottom: 40px;
    color: #565656;
  }
  .members .avatar {
    float: left;
    margin-right: 14px;
  }
  .members .member-info {
    position: relative;
    overflow: hidden;
  }
</style>
