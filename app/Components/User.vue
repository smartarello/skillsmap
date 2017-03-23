<template>
    <div class="container">
        <div v-if="user" class="row">
            <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xs-offset-0 col-sm-offset-0 col-md-offset-2 col-lg-offset-2 User-toppad" >
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <span class="panel-title">{{user.name}} {{user.firstname}}</span>
                        <span class="pull-right User-editButtonContainer" v-if="!edit && isMyprofile">
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
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h3 class="panel-title">Skills</h3>
                    </div>
                    <div class="panel-body">
                        <div v-if="edit" >
                            <skill-select v-on:skillSelected="skillSelected"></skill-select>
                        </div>
                        <ul class="list-group User-skillList"  v-if="user.skills.length != 0">
                            <li v-for="skill in user.skills" class="list-group-item">

                                <button v-on:click="removeSkill(skill.name)" v-if="edit" type="button" class="btn btn-warning User-deleteSkillButton"><i class="glyphicon glyphicon-remove"></i></button>
                                <div class="User-skill">
                                    <span>{{ skill.name }}</span>
                                    <span v-if="skill.votes != 0" class="User-skillVoteBadge">{{skill.votes}}</span>
                                </div>
                                <button v-on:click="vote(skill.name)" v-if="!isMyprofile && !alreadyVote(skill.name)" type="button" class="btn btn-primary User-voteButton"><i class="User-voteButtonIcon glyphicon glyphicon-plus"></i></button>
                                <span v-if="!isMyprofile && alreadyVote(skill.name)" class="User-votedIconContainer"><i class="User-votedIcon glyphicon glyphicon-thumbs-up"></i></span>
                            </li>
                        </ul>
                    </div>
                </div>

                <button v-if="edit" v-on:click="onSave"  type="button" class="btn btn-primary  col-sm-2 col-xs-12">Save</button>
                <button v-if="edit" v-on:click="onCancel"  type="button" class="btn btn-default  col-sm-2 col-xs-12 User-cancelButton">Cancel</button>
            </div>
        </div>
    </div>
</template>


<script>

    import skillSelect from './SkillSelect.vue';

    export default {
        data: function(){
          return {user: null, edit: false}
        },

      components: {skillSelect},

      watch: {
        '$route' (to, from) {

          if (to.name == 'user' && to.params.username != this.user.username) {
            this.getUserInfos();
          }
        }
      },

      computed: {
        twitterUrl(){
          return "http://twitter.com/" + this.user.twitter;
        },

        isMyprofile(){
            return this.user && this.$store.state.user && (this.user.username == this.$store.state.user.username);
        }
      },

      methods: {

          alreadyVote(skill){
            for (let i = 0; i < this.user.skills.length; i++) {
              if (this.user.skills[i].name == skill) {
                if (this.user.skills[i].userIds.indexOf(this.$store.state.user.id) != -1 || this.user.skills[i].userIds.indexOf(""+this.$store.state.user.id) != -1) {
                  return true;
                }

                return false;
              }
            }

            return false;
          },

        vote(skill) {
          let modifiedSkillList = [];
          for (let i = 0; i < this.user.skills.length; i++) {
            if (this.user.skills[i].name != skill) {
              modifiedSkillList.push(this.user.skills[i]);
            } else {
              let modifiedSkill = this.user.skills[i];
              modifiedSkill.votes = modifiedSkill.votes+1;
              modifiedSkill.userIds.push(this.$store.state.user.id);
              modifiedSkillList.push(modifiedSkill);
            }
          }

          this.user.skills = modifiedSkillList;

          this.$http.post('/api/skills/vote', {user: this.user.id, skill: skill});
        },

        skillSelected(values){

            if (!values || values.length == 0) {
              return;
            }

          let skill = values[0];
          for (let i = 0; i<this.user.skills.length; i++) {
            if (this.user.skills[i].name == skill) {
              return; // The skill is already in the list
            }
          }

          this.user.skills.push({name: skill, votes: 0});
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
        background-color: transparent;
        border: 0;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
        box-shadow: inset 0 0 0 1px #f0ad4e, inset 0 0 0 2px transparent, inset 0 0 0 3px transparent;
        border-radius: 16px;
        width: 32px;
        padding: 0;
    }

    .User-voteButton {
        background-color: transparent;
        border: 0;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
        box-shadow: inset 0 0 0 1px #0084bf, inset 0 0 0 2px transparent, inset 0 0 0 3px transparent;
        border-radius: 16px;
        width: 32px;
        padding: 2px;
    }

    .User-skillVoteBadge:before {
        content:"• ";
    }

    .User-voteButtonIcon {
        font-family: "Verdana", "Helvetica Neue", "Helvetica";
        font-size: 24px;
        margin: -4px 0 0;
    }

    .User-skill {
        background-color: #e6e9ec;
        height: 32px;
        line-height: 32px;
        font-size: 15px;
        padding: 0 12px;
        border-radius: 32px;
        display: inline-block;
    }

    .User-votedIconContainer {
        background-color: transparent;
        color: #5cb85c;
        border: 0;
        box-sizing: border-box;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
        box-shadow: inset 0 0 0 1px #5cb85c, inset 0 0 0 2px transparent, inset 0 0 0 3px transparent;
        border-radius: 16px;
        width: 32px;
        padding: 3px 0 0;
        text-align: center;
        font-size: 16px;
    }

    .User-cancelButton {
        margin-left: 10px;
        margin-bottom: 20px;
    }

    .User-editButtonContainer {
        margin-top: -4px;
    }

</style>