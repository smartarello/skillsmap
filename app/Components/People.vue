<template>
  <div class="container-fluid People">
    <h1>People</h1>
    <div class="row">

      <div class="col-lg-10 col-md-10 col-sm-9 col-xs-12">
        <div class="row">
          <search-bar class="People-searchBar col-xs-12 col-sm-12 col-md-6"></search-bar>
        </div>
        <div class="row">
          <user-card v-for="user in users" :user="user"></user-card>
        </div>
      </div>
      <div class="col-lg-2 col-md-2 col-sm-3 hidden-xs">
      </div>
    </div>
  </div>
</template>

<script>
import UserCard from './UserCard.vue'
import SearchBar from './SearchBar.vue'

export default {
  name: 'people',
  computed: {
    users(){
      return this.$store.state.people;
    }
  },
  components: {'user-card' : UserCard, 'search-bar' : SearchBar},

  mounted: function () {
    this.$store.dispatch('loadPeople');
  }
}
</script>

<style  lang="scss">
.People-searchBar {
  margin-left: 18px;
}
</style>
