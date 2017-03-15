import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

let apiUrl = 'http://localhost:3000';

export default new Vuex.Store({
  state: {
    people: []
  },
  mutations: {
    loadPeople(state, people) {
      state.people = people;
    }
  },

  actions: {
      loadPeople (context) {
        Vue.http.get(apiUrl + '/api/people').then(
        (res) => {
          context.commit('loadPeople', res.body)
        },
        function (err) {
          console.log(err);
        });
      }
  }
})
