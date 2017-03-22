<template>
  <div class="People">
    <h1 class="People-title">People</h1>
    <div class="row">

      <div class="col-lg-9 col-md-9 col-sm-9 col-xs-12">
        <div class="row">
          <search-bar v-on:submit="onSubmit" class="People-searchBar col-xs-12 col-sm-12 col-md-8 col-md-offset-2"></search-bar>
        </div>
        <div class="row">
          <user-card v-for="user in users" :user="user" class="col-lg-3 col-md-4 col-sm-6 col-xs-12"></user-card>
        </div>
        <infinite-loading :on-infinite="loadMore" ref="infiniteLoading">
          <span slot="no-more">
          </span>
        </infinite-loading>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 hidden-xs">
        <top-skills></top-skills>
      </div>
    </div>
  </div>
</template>

<script>
import UserCard from './UserCard.vue'
import SearchBar from './SearchBar.vue'
import InfiniteLoading from 'vue-infinite-loading';
import TopSkills from './TopSkills.vue';

export default {
  name: 'people',

  data: function(){
    return {users: [], start: 0, filter: ''};
  },

  components: {'user-card' : UserCard, 'search-bar' : SearchBar, 'infinite-loading': InfiniteLoading, 'top-skills': TopSkills},

  methods: {

    onSubmit(filter){
      this.filter = filter;
      this.start = 0;
      this.users = [];

      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
    },

    loadMore(){
      this.$http.get('/api/user/search?start='+this.start+'&q='+this.filter).then(
        (res) => {

          for (let i = 0; i < res.body.length; i++) {
            this.users.push(res.body[i]);
          }

          this.start += res.body.length;
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');

          if (res.body.length < 25) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
        },
        (err)=> {
          console.log(err);
        });
    }
  }
}
</script>

<style  lang="scss">
.People-title {
  color: #FFFFFF;
  font-family: 'Poller One', cursive;
  margin-bottom: 30px;
}
</style>
