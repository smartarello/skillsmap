<template>
  <div class="Login container">
    <h3 class="Login-title">Login with Google...</h3>
    <div class="Login-loader"></div>
  </div>
</template>

<script>
export default {
  name: 'login',

  methods: {

    getParameterByName: function (name) {

      let url = window.location.href;

      name = name.replace(/[\[\]]/g, "\\$&");
      let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  },

  mounted: function () {
    let code = this.getParameterByName('code');
    // If the code is present, the callback url was called by google
    // We have the google code to retrieve the user data
    if (code) {
      this.$http.get('/api/login?code='+code).then(
      (res) => {
        this.$store.commit('userLoggedIn', res.body);
      });
    } else {
      this.$http.get('/api/getOAuthUrl').then(
      (res) => {
        if (res.body && res.body.googleUrl) {
          window.location.href = res.body.googleUrl;
        } else if (res.body.user) {
          this.$store.commit('userLoggedIn', res.body.user);
        }
      });
    }
  }
}
</script>

<style  lang="scss">
  .Login {
    width: 400px;
    height: 400px;
    background-color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-top: 80px;
  }

  .Login-title {
    margin-top: 55px;
    text-align: center;
    color: #D20108;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }


  .Login-loader {
    margin: 50px auto 0;
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spinner 2s linear infinite;
  }

  @keyframes spinner {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
