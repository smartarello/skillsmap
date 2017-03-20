<template>
<div class="SearchBar">
  <div class="input-group stylish-input-group">
    <input v-model="filter" v-on:keyup.enter="onSubmit" type="text" class="form-control SearchBar-input" placeholder="Search for...">
    <span class="input-group-addon SearchBar-buttonContainer">
        <button type="submit" class="SearchBar-button">
            <span class="glyphicon glyphicon-search"></span>
        </button>
    </span>
  </div>
</div>
</template>

<script>
  export default {
    name:'search-bar',

    data: function(){
      return {filter: ''};
    },

    methods: {
      onSubmit(){
        this.$emit('submit', this.filter);
      }
    }
  }
</script>


<style lang="scss">
.SearchBar-buttonContainer{
    background: white !important;
}
.SearchBar-input{
	border-right:0;
	box-shadow:0 0 0;
	border-color:#ccc;
}
.SearchBar-button{
    border:0;
    background:transparent;
}
</style>
