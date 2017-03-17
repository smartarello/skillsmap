<template>
    <div class="container">
        <div v-if="user" class="row">
            <img :src="user.picture" class="col-md-2" />
            <div class="col-md-10">
                <div>{{user.name}}</div>
            </div>
        </div>
    </div>
</template>


<script>

    export default {
        data: function(){
          return {user: null}
        },

        mounted: function() {
          if (this.$route.params.username) {
            this.$http.get('/api/user?username=' + this.$route.params.username).then(
              function (res) {
                this.user = res.body;
              },
              function (err) {
                console.log(err);
              });
          }
        }
    }

</script>