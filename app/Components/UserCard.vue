<template>
  <div class="UserCard">
    <div v-on:click="showUserDetails" class="UserCard-container ">
      <div class="UserCard-pictureContainer"><img class="UserCard-picture" :src="user.picture"/></div>
      <div class="UserCard-name">{{ user.name }} {{ user.firstname}}</div>
      <div class="UserCard-jobTitle">{{ user.jobTitle }}</div>

        <ul class="UserCard-skills" v-if="user.skills.length != 0">
          <li v-for="skill in user.skills" >
            {{ skill }}
          </li>
        </ul>

    </div>
  </div>
</template>

<script>
  export default {
    name:'user-card',
    props: ['user'],

    methods: {
      showUserDetails: function() {
        this.$store.commit('showUserDetails', this.user);
      }
    }

  }
</script>

<style lang="scss">

  .UserCard {



    &-container {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    background-color: #FFFFFF;
    height: 300px;
    width: 215px;
    margin: 20px auto 0;
    cursor: pointer;
  }

    &-pictureContainer {

      padding-top: 15px;
    }

    &-picture {
      margin: 0 auto;
      display: block;
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }

      &-name {
        color: #5A5B53;
        font-weight: bold;
        margin-top: 15px;
        font-size: 14px;
        padding-left: 15px;
      }

      &-jobTitle {

        font-size: 12px;
        color: #D20108;
        padding-left: 15px;
        margin-top: 5px;
      }

      &-skills {
        font-size: 12px;
        color: #8C8D87;
        padding-left: 30px;
        margin-top: 20px;
      }
  }
</style>
