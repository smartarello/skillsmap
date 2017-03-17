<template>
  <div class="Login container">
    <div v-if="googleUrl == ''"  class="Login-loaderContainer"><div class="Login-loader"></div></div>
    <h2 class="Login-title">Skills map</h2>
    <div class="Login-buttonContainer">
      <button v-on:click="connect" type="button" class="btn btn-lg Login-button"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data: function(){
    return {'googleUrl' : ''}
  },

  methods: {
    connect: function(event) {
      if (this.googleUrl) {
        window.location.href = this.googleUrl;
        this.googleUrl = "";
      }
    },

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
        this.$router.push({path : 'people'});
      });
    } else {
      this.$http.get('/api/getOAuthUrl').then(
      (res) => {
        if (res.body && res.body.googleUrl) {
          this.googleUrl = res.body.googleUrl;
        } else if (res.body.alreadyConnected) {
          this.$router.push({path : 'people'});
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
    position: relative;
  }

  .Login-title {
    margin-top: 55px;
    text-align: center;
    color: #D20108;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
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
    width: 400px;
    height: 400px;
    background-color: #000000;
    opacity: 0.3;
  }

  .Login-loader {
    margin: 230px auto 0;
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
