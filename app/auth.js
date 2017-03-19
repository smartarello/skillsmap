import Vue from 'vue'
import store from './store'
import router from './router'

/**
 * Auth Plugin
 *
 * (see https://vuejs.org/v2/guide/plugins.html for more info on Vue.js plugins)
 *
 * Handles login and token authentication using OAuth2.
 */
export default {

  /**
   * Install the Auth class.
   *
   * Creates a Vue-resource http interceptor to handle automatically adding auth headers
   * and refreshing tokens. Then attaches this object to the global Vue (as Vue.auth).
   *
   * @param {Object} Vue The global Vue.
   * @param {Object} options Any options we want to have in our plugin.
   * @return {void}
   */
  install (Vue, options) {
    Vue.http.interceptors.push((request, next) => {

      next((response) => {
        if (!store.state.user || !store.state.user.username) {
          return this.refreshToken(request);
        }
      })
    });

    Vue.prototype.$auth = Vue.auth = this
  },

  /**
   * Retry the original request.
   *
   * Let's retry the user's original target request that had recieved a invalid token response
   * (which we fixed with a token refresh).
   *
   * @param {Request} request The Vue-resource Request instance to use to repeat an http call.
   * @return {Promise}
   */
  retry (request) {

    return Vue.http(request)
      .then((response) => {
        return response
      })
      .catch((response) => {
        return response
      })
  },

  /**
   * Refresh the access token
   *
   * Make an ajax call to the OAuth2 server to refresh the access token (using our refresh token).
   *
   * @private
   * @param {Request} request Vue-resource Request instance, the original request that we'll retry.
   * @return {Promise}
   */
  refreshToken (request) {

    console.log(request);
    return Vue.http.get('/api/getOAuthUrl')
      .then((result) => {
        if(result.user) {
          store.commit('updateUser', result.user);
        } else {
            //router.push('/login');
        }

        return this.retry(request);
      });
  }
}