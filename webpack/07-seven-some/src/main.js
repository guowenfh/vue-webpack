import Vue from 'vue';

// if (process.env.NODE_ENV === 'development') {
//   window.ga = function() {};
// }
Vue.config.debug = true;

import VueRouter from 'vue-router';
import registerRouters from './routers';
import App from './app.vue';

Vue.use(VueRouter);

var router = new VueRouter({
});

registerRouters(router);

router.start(App, '#app');
