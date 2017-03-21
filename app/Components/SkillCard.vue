<template>
    <div class="SkillCard">
        <div class="SkillCard-container ">
            <div class="SkillCard-name">{{ skill.name }}</div>
            <ul class="SkillCard-users" v-if="skill.users.length != 0">
                <li v-for="user in skill.users" class="SkillCard-user">
                    <span class="SkillCard-userVote badge">{{ user.votes }}</span>
                    <img :src="user.picture" class="img-circle img-responsive SkillCard-userPicture" />
                    <span>{{ user.name }} {{user.firstname}}</span>
                </li>
            </ul>

        </div>
    </div>
</template>

<script>
  export default {
    name:'skill-card',
    props: ['skill'],

    methods: {

    }
  }
</script>

<style lang="scss">

    .SkillCard {

    margin-top: 15px;

    &-container {
         box-shadow: 0 2px 4px rgba(0,0,0,0.1);
         background-color: #FFFFFF;
         height: 250px;
         width: 250px;

     }

    &-name {
         color: #5A5B53;
         font-weight: bold;
         padding-top: 15px;
         font-size: 16px;
         text-align: center;
     }

     &-user {
        padding-top: 10px;
      }

    &-users {
         font-size: 12px;
         color: #8C8D87;
         padding-left: 15px;
         margin-top: 20px;
        list-style: none;
     }

     &-userPicture {
        width: 30px;
        display: inline-block;
        margin-right: 3px;
      }
    }
</style>
