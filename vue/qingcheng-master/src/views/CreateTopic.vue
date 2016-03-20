<template>
  <div class="fullpage">
    <div class="container">
      <topic-form :cafe="cafe" type="create" v-ref:form></topic-form>
    </div>
  </div>
</template>

<script>
import api from '../api';
import TopicForm from '../components/TopicForm.vue';

export default {
  props: ['cafe'],
  ready() {
    var vm = this.$refs.form;
    var router = this.$route.router;
    var slug = this.cafe.slug;
    vm.$on('submit', payload => {
      api.topic.create(slug, payload, resp => {
        router.go({name: 'topic', params: {topicId: resp.id}});
      });
    });
  },
  components: {
    TopicForm
  }
};
</script>
