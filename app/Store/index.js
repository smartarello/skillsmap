import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router.js'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    userLoggedIn(state, user) {
      console.log('userLoggedIn');
      state.user = user;
      router.push({name: 'home'});
    },

    showUserDetails(state, user) {
      router.push({name: 'user', params: {username: user.username}});
    },

    updateUser(state, user){
      state.user = user;
    }
  },

  actions: {
  }
})
