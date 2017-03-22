<template>
    <div>
        <nav v-if="isLoggedIn"  class="navbar navbar-inverse navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">Skills Map</a>
                </div>
                <div id="navbar" class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li><router-link to="/home" >People</router-link></li>
                        <li><router-link to="/skills" >Skills</router-link></li>
                        <li><router-link :to="myProfileUrl" >My profile</router-link></li>
                    </ul>
                </div><!--/.nav-collapse -->
            </div>
        </nav>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'app',
      computed: {
        isLoggedIn(){
          return typeof this.$store.state.user.username !== 'undefined';
        },

        myProfileUrl(){
          if (this.$store.state.user && this.$store.state.user.username) {
            return '/user/'+this.$store.state.user.username;
          } else {
            return '';
          }
        }
      }
    };

</script>

<style>
    .navbar-inverse .navbar-nav>li>a.router-link-active {color: #FFFFFF;}
</style>