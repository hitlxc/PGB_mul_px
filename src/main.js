import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Track from './pagelet/track.vue';
import Setting from './pagelet/setting.vue'
import 'element-ui/lib/theme-chalk/index.css';
import Element from 'element-ui';

Vue.use(VueRouter);
Vue.use(Element);


const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/track' },
        { path: '/track', component: Track },
        { path: '/setting', component: Setting}
    ]
})

new Vue({
    el: '#app', 
    router,
    template: '<App/>',
    components: { App }
})