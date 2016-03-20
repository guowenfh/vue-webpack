<template>
  <div class="body cafe-list">
    <logo class="logo--loading center" v-if="$loadingRouteData"></logo>

    <div class="section container" v-if="following.length">
      <h2 class="section-title">Following</h2>
      <div class="cafe-cards clearfix">
        <template v-for="cafe in following" track-by="id">
          <cafe-card :subpath="subpath" :cafe="cafe"></cafe-card>
        </template>
      </div>
    </div>

    <div class="section container">
      <h2 class="section-title">Cafes</h2>
      <div class="cafe-cards clearfix">
        <template v-for="cafe in cafes" track-by="id">
          <cafe-card :subpath="subpath" :cafe="cafe"></cafe-card>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';
import CafeCard from '../components/CafeCard.vue';
import Logo from '../components/Logo.vue';

export default {
  data() {
    return {
      cursor: 0,
      following: [],
      cafes: [],
    }
  },
  computed: {
    subpath() {
      if (this.$route.query.show === 'create') {
        return '/create';
      }
      return '';
    }
  },
  route: {
    data(transition) {
      api.cafe.list(resp => {
        transition.next({
          following: resp.following || [],
          cafes: resp.data,
          cursor: resp.cursor,
        })
      });
    }
  },
  components: {
    CafeCard,
    Logo
  }
};
</script>

<style>
.cafe-list {
  padding: 40px 0;
}
</style>
