<template>
    <div class="container">
        <div v-if="user" class="row">
            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xs-offset-0 col-sm-offset-0 col-md-offset-2 col-lg-offset-2 User-toppad" >
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <span class="panel-title">{{user.name}} {{user.firstname}}</span>
                        <span class="pull-right" v-if="!edit && isMyprofile">
                            <button v-on:click="onEdit" data-original-title="Edit" data-toggle="tooltip" type="button" class="btn btn-sm btn-warning"><i class="glyphicon glyphicon-edit"></i></button>
                        </span>
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
                                            <input v-model="user.job_title" class="form-control"  v-if="edit" type="text"/>
                                            <span v-else>{{ user.job_title }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Twitter:</td>
                                        <td>
                                            <input v-model="user.twitter" class="form-control"  v-if="edit" type="text"/>
                                            <a v-else target="_blank" :href="twitterUrl">{{ user.twitter }}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Web site:</td>
                                        <td>
                                            <input v-model="user.website" class="form-control"  v-if="edit" type="text"/>
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
                            <skill-select v-bind:value="selectedSkill" v-on:onsearch="onSearch" v-on:skillChanged="skillChanged" class="col-xs-9 col-sm-9 col-md-9 col-lg-10"></skill-select>
                            <button v-on:click="addSkill" type="button" class="btn btn-default col-xs-2 col-sm-2 col-md-2 col-lg-1">add</button>
                        </div>
                        <ul class="list-group User-skillList"  v-if="user.skills.length != 0">
                            <li v-for="skill in user.skills" class="list-group-item">
                                <button v-on:click="removeSkill(skill.name, user)" v-if="edit" type="button" class="btn btn-warning User-deleteSkillButton"><i class="glyphicon glyphicon-remove"></i></button>
                                <span v-if="skill.votes != 0" class="badge">{{skill.votes}}</span>
                                {{ skill.name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <button v-if="edit" v-on:click="onSave"  type="button" class="btn btn-primary  col-sm-2 col-xs-12 col-sm-offset-8 col-md-offset-8">Save</button>
                <button v-if="edit" v-on:click="onCancel"  type="button" class="btn btn-default  col-sm-2 col-xs-12">Cancel</button>
            </div>
        </div>
    </div>
</template>


<script>

    import skillSelect from './SkillSelect.vue';

    export default {
        data: function(){
          return {user: null, selectedSkill: "", skillText: "", edit: false}
        },

      components: {skillSelect},

      computed: {
        twitterUrl(){
          return "http://twitter.com/" + this.user.twitter;
        },

        isMyprofile(){
            return this.user && this.$store.state.user && (this.user.username == this.$store.state.user.username);
        }
      },

      methods: {
        skillChanged(skill){
          this.skillText = "";
          this.selectedSkill = skill;
        },

        onSearch(text){
          this.skillText = text;
        },

        addSkill(){

          let skill = this.selectedSkill;
          if (skill.trim() == "") {
            skill = this.skillText;
          }

          let exists = this.user.skills.indexOf(skill);
          if (exists == -1) {
            this.user.skills.push({name: skill, votes: 0});
          }

          this.selectedSkill = "";
          this.skillText = "";
        },


        removeSkill(skill) {
         let modifiedSkillList = [];
         for (let i = 0; i < this.user.skills.length; i++) {
           if (this.user.skills[i].name != skill) {
             modifiedSkillList.push(this.user.skills[i]);
           }
         }

         this.user.skills = modifiedSkillList;
        },

        onEdit(){
          this.edit = true;
        },

        onSave(){
          this.edit = false;
          this.$http.post('/api/user/save', {user: this.user});
        },

        onCancel(){
          // refresh data with the server infos
          this.getUserInfos();
          this.edit = false;
        },

        getUserInfos(){
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
      },

        mounted: function() {
          this.getUserInfos();
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

    .User-deleteSkillButton {
        width: 25px;
        height: 25px;
        text-align: center;
        padding: 0 0 2px 1px;
        font-size: 14px;
        border-radius: 15px;
    }

</style>