import Vue from 'vue'
import People from './Components/People.vue'
import VueRouter from 'vue-router'
import Resource from 'vue-resource'
import store from './store'

Vue.use(Resource);
Vue.use(VueRouter);

const routes = [
  { path: '/', component: People }
];

class SkillsMapping {
  constructor(){
    const router = new VueRouter({
      routes
    });

    this.vue = new Vue({
      router,
      store,
       el: '#app'
    });
  }
}

$(function(){

  window.app = new SkillsMapping();

});
