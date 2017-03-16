<template>
  <div class="Login container">
    <div class="row">
    <div class="Login-buttonContainer">
      <button v-on:click="connect" v-if="googleUrl != ''" type="button" class="btn btn-default">Connect</button>
    </div>
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
.Login-buttonContainer {
  text-align: center;
}
</style>
