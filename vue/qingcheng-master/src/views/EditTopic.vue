<template>
  <div class="fullpage">
    <div class="container" v-show="!$loadingRouteData">
      <topic-form :cafe="cafe" :topic="topic" type="update" v-ref:form></topic-form>
    </div>
  </div>
</template>

<script>
import api from '../api';
import TopicForm from '../components/TopicForm.vue';

export default {
  data() {
    return {
      topic: {content: ''},
      cafe: {}
    };
  },
  route: {
    waitForData: true,
    data(transition) {
      var id = transition.to.params.topicId;
      api.topic.viewRaw(id, resp => {
        document.title = this.$site.name + ' — Edit: ' + resp.title;
        transition.next({
          topic: resp,
          cafe: resp.cafe,
        });
      });
    }
  },
  ready() {
    var vm = this.$refs.form;
    var router = this.$route.router;
    vm.$on('submit', payload => {
      api.topic.update(this.topic.id, payload, resp => {
        router.go({name: 'topic', params: {topicId: resp.id}});
      });
    });
  },
  components: {
    TopicForm
  }
};
</script>
