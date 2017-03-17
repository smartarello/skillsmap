import Vue from 'vue'
import Resource from 'vue-resource'
import store from './store'
import router from './router.js'

Vue.use(Resource);

class SkillsMapping {
  constructor(){

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


