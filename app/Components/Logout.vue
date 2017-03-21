<template>
    <div class="Logout container">
        <div class="Logout-loaderContainer"><div class="Logout-loader"></div></div>
        <h3 class="Logout-title">Login out...</h3>
    </div>
</template>

<script>
  export default {
    name: 'logout',

    mounted: function () {

        this.$http.post('/api/logout').then(
          (res) => {
            this.$store.commit('userLoggedOut', res.body);
          });

    }
  }
</script>

<style  lang="scss">
    .Logout {
        width: 400px;
        height: 400px;
        margin-top: 80px;
        position: relative;
    }

    .Logout-title {
        margin-top: 55px;
        text-align: center;
        color: #D20108;
        font-family: robotomedium;
    }



    .Logout-loaderContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 400px;
        height: 400px;
        background-color: #000000;
        opacity: 0.3;
    }

    .Logout-loader {
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
