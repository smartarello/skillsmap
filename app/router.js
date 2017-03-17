import Vue from 'vue';
import VueRouter from 'vue-router'
import Login from './Components/Login.vue'
import People from './Components/People.vue'
import User from './Components/User.vue'

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Login },
  { path: '/people', component: People},
  { path: '/user/:username', component: User, name: 'user'}
];

const router = new VueRouter({
  routes
});

export default router;
