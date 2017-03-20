<template>
    <div>
        <nav v-if="isLoggedIn" class="navbar navbar-default">
            <div class="container">
                <ul class="nav navbar-nav">
                    <li><router-link to="/home">Home</router-link></li>
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
        }
      }
    };

</script>