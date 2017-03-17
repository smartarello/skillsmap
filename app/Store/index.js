import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router.js'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    people: [],
    user: {}
  },
  mutations: {
    loadPeople(state, people) {
      state.people = people;
    },

    showUserDetails(state, user) {

    }
  },

  actions: {
      loadPeople (context) {
        Vue.http.get('/api/people').then(
        (res) => {
          context.commit('loadPeople', res.body)
        },
        function (err) {
          console.log(err);
        });
      },

      showUserDetails(context, user){
        router.push({name: 'user', params: {username: user.username}});
      }
  }
})
