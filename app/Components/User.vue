<template>
    <div class="container">
        <div v-if="user" class="row">
            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xs-offset-0 col-sm-offset-0 col-md-offset-2 col-lg-offset-2 User-toppad" >
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h3 class="panel-title">{{user.name}} {{user.firstname}}</h3>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-md-3 col-lg-3 " align="center">
                                <img alt="User Pic" :src="user.picture" class="img-circle img-responsive">
                            </div>

                            <div class=" col-md-9 col-lg-9 ">
                                <table class="table User-information">
                                    <tbody>
                                    <tr>
                                        <td>Job title:</td>
                                        <td>{{ user.job_title }}</td>
                                    </tr>
                                    <tr>
                                        <td>Twitter:</td>
                                        <td>{{ user.twitter }}</td>
                                    </tr>
                                    <tr>
                                        <td>Web site:</td>
                                        <td>{{ user.website }}</td>
                                    </tr>
                                    <tr>
                                        <td>E-mail:</td>
                                        <td>{{ user.username }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
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

<style lang="scss">
    .User-information > tbody > tr {
        border-top: 1px solid rgb(221, 221, 221);
    }

    .User-information > tbody > tr:first-child {
        border-top: 0;
    }


    .User-information > tbody > tr > td {
        border-top: 0;
    }

    .User-toppad
    {
        margin-top:20px;
    }
</style>