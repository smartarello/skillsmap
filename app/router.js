import Vue from 'vue';
import VueRouter from 'vue-router'
import Login from './Components/Login.vue'
import Logout from './Components/Logout.vue'
import People from './Components/People.vue'
import User from './Components/User.vue'
import Skills from './Components/Skills.vue'

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Login, name: 'login' },
  { path: '/logout', component: Logout, name: 'logout' },
  { path: '/home', component: People, name: 'home'},
  { path: '/user/:username', component: User, name: 'user'},
  { path: '/skills', component: Skills, name: 'skills'}
];

const router = new VueRouter({
  routes
});

export default router;
