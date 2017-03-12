<template>
  <div class="container-fluid">
    <h1>People</h1>
    <div class="row">
      <user-card v-for="user in users" :user="user"></user-card>
    </div>
  </div>
</template>

<script>
import UserCard from './UserCard.vue'

export default {
  name: 'people',
  data: function() {
    return{
      users: []
    }
  },
  components: {'user-card' : UserCard},


  mounted: function () {
    this.fetchUsers();
  },
  methods: {
    fetchUsers: function () {
      this.$http.get('http://skills.frsa02-j5cbkc2.crossknowledge.lan:3000/api/people').then(
      function (res) {
        this.users =  res.body;

      },
      function (err) {
        console.log(err);
      });
    }
  }
}
</script>

<style>
.message {
  color: blue;
}
</style>
