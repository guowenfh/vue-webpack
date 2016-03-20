import Vue from 'vue';

var zerqu = window.ZERQU || {};

if (process.env.NODE_ENV === 'development') {
  window.ga = function() {};
  Vue.config.debug = true;
}

require('../lib/css/base.css');
require('../lib/css/ui.css');

import VueRouter from 'vue-router';
import registerRouters from './routers';
import App from './App.vue';
import * as filters from './filters';

Object.defineProperty(Vue.prototype, '$site', {
  get: function() {
    return zerqu.site || {name: 'ZERQU'};
  }
});

// register filters
Object.keys(filters).forEach(function(k) {
  Vue.filter(k, filters[k]);
});

Vue.use(VueRouter);

var router = new VueRouter({
  hashbang: false,
  history: true,
  saveScrollPosition: true
});

registerRouters(router);

router.start(App, '#app');
require('./api').register(router.app);
