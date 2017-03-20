<template>
    <div>
        <nav v-if="isLoggedIn" class="navbar navbar-default">
            <div class="container">
                <ul class="nav navbar-nav">
                    <li><router-link to="/home">Home</router-link></li>
                    <li><router-link to="/skills">Skills</router-link></li>
                    <li><router-link :to="myProfileUrl">Profile</router-link></li>
                </ul>
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