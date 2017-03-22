<template>
  <div class="Login">
    <div v-if="processingLogin"  class="Login-loaderContainer"><div class="Login-loader"></div></div>
    <h3 class="Login-title">Skills Map</h3>
    <div class="Login-buttonContainer">
      <button v-on:click="connect" type="button" class="btn btn-lg Login-button"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',

  data: function(){
    return {'googleUrl' : '', processingLogin: false}
  },


  methods: {
    connect(event) {
      if (this.googleUrl) {
        window.location.href = this.googleUrl;
        this.processingLogin = true;
      }
    },

      getParameterByName(name) {

      let url = window.location.href;

      name = name.replace(/[\[\]]/g, "\\$&");
      let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    getOAuthUrl(){
      this.$http.get('/api/getOAuthUrl').then(
        (res) => {
          if (res.body && res.body.googleUrl) {
            this.googleUrl = res.body.googleUrl;
          } else if (res.body.user) {
            this.$store.commit('userLoggedIn', res.body.user);
          }
        }
      );
    }
  },

  mounted: function () {
    let code = this.getParameterByName('code');
    // If the code is present, the callback url was called by google
    // We have the google code to retrieve the user data
    if (code) {
      this.processingLogin = true;
      this.$http.get('/api/login?code='+code).then(
      (res) => {
        this.$store.commit('userLoggedIn', res.body);
      },
        (res) => {
          // error
          this.processingLogin = false;
          this.getOAuthUrl();
        }

      );
    } else {
      this.getOAuthUrl();
    }
  }
}
</script>

<style  lang="scss">
  .Login {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 80px auto;
    padding: 50px 40px 40px;
    text-align: center;
    background: #fff;
    border: 1px solid #ccc;
  }

  .Login-title {
    text-align: center;
    color: #D20108;
    font-family: 'Poller One', cursive;
  }

  .Login-buttonContainer {
    text-align: center;
    margin-top: 50px;
  }

  .Login-button {
    background: url('/assets/images/btn_google_signin_light_normal_web.png') no-repeat center;
    width: 196px;
    height: 50px;
  }

  .Login-loaderContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 300px;
    height: 300px;
    background-color: #000000;
    opacity: 0.3;
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



  .Login::before,.Login::after{
    content: "";
    position: absolute;
    width: 100%;height: 100%;
    top: 3.5px;left: 0;
    background: #fff;
    z-index: -1;
    -webkit-transform: rotateZ(4deg);
    -moz-transform: rotateZ(4deg);
    -ms-transform: rotateZ(4deg);
    border: 1px solid #ccc;

  }

  .Login::after{
    top: 5px;
    z-index: -2;
    -webkit-transform: rotateZ(-2deg);
    -moz-transform: rotateZ(-2deg);
    -ms-transform: rotateZ(-2deg);

  }
</style>
