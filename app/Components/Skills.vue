<template>
    <div class="Skills container">
        <h1>Skills</h1>
        <div class="row">
            <search-bar v-on:submit="onSubmit" class="People-searchBar col-xs-12 col-sm-12 col-md-9"></search-bar>
        </div>
        <div class="row">
            <skill-card v-for="skill in skills" :skill="skill" class="col-lg-3 col-md-4 col-sm-6 col-xs-12"></skill-card>
        </div>
        <infinite-loading :on-infinite="loadMore" ref="infiniteLoading">
          <span slot="no-more">
          </span>
        </infinite-loading>
    </div>
</template>

<script>

  import SkillCard from './SkillCard.vue';
  import InfiniteLoading from 'vue-infinite-loading';
  import SearchBar from './SearchBar.vue'

  export default {
    name: 'skills',

    data: function(){
      return {skills: [], start: 0, filter: ''};
    },

    components: {'skill-card' : SkillCard, 'infinite-loading': InfiniteLoading, 'search-bar' : SearchBar},

    methods: {
      onSubmit(filter){
        this.filter = filter;
        this.start = 0;
        this.skills = [];

        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
      },

        loadMore(){
          this.$http.get('/api/skills?start='+this.start+"&q="+this.filter).then(
            (res) => {

              for (let i = 0; i < res.body.length; i++) {
                this.skills.push(res.body[i]);
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

</style>
