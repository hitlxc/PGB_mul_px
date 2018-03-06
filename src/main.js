import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Track from './pagelet/track.vue';

import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui';

Vue.use(VueRouter);
Vue.use(Element);


const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/track' },
    { path: '/track', component: Track }

  ]
})


//const router = new VueRouter();
/*
router.map({
  '/hello': {
    component: hello,
  },
});


router.redirect({
  '*': '/list',
});

router.start(App, '#app');
*/




new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})