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
                                        <td>
                                            <input class="form-control"  v-if="edit" type="text" name="" :value="user.job_title" />
                                            <span v-else>{{ user.job_title }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Twitter:</td>
                                        <td>
                                            <input class="form-control"  v-if="edit" type="text" name="" :value="user.twitter" />
                                            <a v-else target="_blank" :href="twitterUrl">@{{ user.twitter }}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Web site:</td>
                                        <td>
                                            <input class="form-control"  v-if="edit" type="text" name="" :value="user.website" />
                                            <span v-else>{{ user.website }}</span>
                                        </td>
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

            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xs-offset-0 col-sm-offset-0 col-md-offset-2 col-lg-offset-2" >
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h3 class="panel-title">Skills</h3>
                    </div>
                    <div class="panel-body">
                        <div class="row" v-if="edit" >
                            <skill-select v-bind:value="selectedSkill" ref="skillSelect" v-on:skillChanged="skillChanged" class="col-xs-9 col-sm-9 col-md-9 col-lg-10"></skill-select>
                            <button v-on:click="addSkill" type="button" class="btn btn-default col-xs-2 col-sm-2 col-md-2 col-lg-1">add</button>
                        </div>
                        <ul class="list-group User-skillList"  v-if="user.skills.length != 0">
                            <li v-for="skill in user.skills" class="list-group-item">
                                <span v-if="skill.votes != 0" class="badge">{{skill.votes}}</span>
                                {{ skill.name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <button v-if="edit"  type="button" class="btn btn-primary  col-sm-2 col-xs-12 col-sm-offset-10 col-md-offset-10">Save</button>
            </div>
        </div>
    </div>
</template>


<script>

    import skillSelect from './SkillSelect.vue';

    export default {
        data: function(){
          return {user: null, selectedSkill: ""}
        },

      components: {skillSelect},

      computed: {
        edit(){
          return this.user && this.$store.state.user && (this.user.username == this.$store.state.user.username);
        },
        twitterUrl(){
          return "http://twitter.com/" + this.user.twitter;
        }
      },

      methods: {
        skillChanged(skill){
          this.selectedSkill = skill;
        },

        addSkill(){
          let exists = this.user.skills.indexOf(this.selectedSkill);
          if (exists == -1) {
            this.user.skills.push({name: this.selectedSkill, votes: 0});
          }

          this.selectedSkill = "";
        }
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

    .User-skillList {
        margin-top: 15px;
    }

</style>