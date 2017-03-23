<template>
  <div>
    <select class="SkillSelect-select form-control" id="skills-select"  multiple="multiple"></select>
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
      if (!this.value) {
        return '';
      }

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
    jQuery('#skills-select').select2({
      placeholder: "NodeJS, VueJS, Javascript, ...",
      tags: true,
      tokenSeparators: [',', ' '],
      //maximumSelectionLength: 1,
      ajax: {
        url: '/api/skills/search',
        delay: 250,
        processResults: function (data) {
          return {
            results: data
          };
        }
      }
    });

    jQuery('#skills-select').on('select2:select', () => {
      this.$emit('skillSelected', jQuery('#skills-select').val());
      jQuery('#skills-select').val(null).trigger('change');
    });
  },

  methods: {

    onSearch(data){
      this.$emit('onsearch', data);
    }
  }
}
</script>

<style>
  .SkillSelect-select {width: 100%;}
</style>