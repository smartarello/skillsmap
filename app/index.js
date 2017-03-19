import Vue from 'vue'
import Resource from 'vue-resource'
import store from './store'
import router from './router.js'
import App from './App.vue'

Vue.use(Resource);

router.beforeEach((to, from, next) => {
  if (to && to.name != 'login') {
    if(!store.state.user || !store.state.user.username) {


      Vue.http.get('/api/getOAuthUrl').then(
        (res) => {
          if (res.body && res.body.googleUrl) {
            next({name: 'login'});
            return ;
          } else if (res.body.user) {
            store.commit('updateUser', res.body.user);
          }

          next();
        });
      return ;
    }
  }

  next();

});

/* Create and Mount our Vue instance */
new Vue({
  // Attach the Vue instance to the window,
  // so it's available globally.
  created: function () {
    window.Vue = this
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app');


