<template>
  <div>
    <v-select :value="selectedValue" :on-search="onSearch" :debounce="250" :on-change="skillChanged" :options="options" placeholder="VueJS, NodeJS, Javascript, ..." ></v-select>
  </div>
</template>

<script>
import vSelect from 'vue-select';

export default {
  components: {vSelect},

  name: 'skill-select',

  props: ['value'],

  computed: {
    selectedValue(){
      return this.value.trim();
    }
  },

  data: function() {
    return {
      options: []
    }
  },

  mounted: function()
  {
    this.$http.get('/api/skills/search').then( (resp) => {
      this.options = resp.body;
    });
  },

  methods: {
    skillChanged(data){
      this.$emit('skillChanged', data);
    },

    onSearch(data){
      this.$emit('onsearch', data);
    }
  }
}
</script>