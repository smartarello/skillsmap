<template>
  <div class="UserCard col-lg-2 col-md-3 col-sm-4 col-xs-12">
    <div class="UserCard-container ">
      <div class="UserCard-pictureContainer"><img class="UserCard-picture" src="http://placehold.it/350x150"/></div>
      <div class="UserCard-name">{{ user.name }} {{ user.firstname}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name:'user-card',
    props: ['user'],

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
        text-align: center;
      }
  }
</style>
