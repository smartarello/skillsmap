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
      state.user = user;
      router.push({name: 'home'});
    },

    userLoggedOut(state, user) {
      state.user = {};
      router.push({name: 'login'});
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

