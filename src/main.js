import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Hello from './pagelet/hello.vue';

import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui';

Vue.use(VueRouter);
Vue.use(Element);

const router = new VueRouter({
  routes: [
    { path: '/hello', component: Hello }
  ]
})

//const router = new VueRouter();
/*
router.map({
  '/hello': {
    component: hello,
  },
});


//router.redirect({
//  '*': '/list',
//});

router.start(App, '#app');
*/




new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})