<template>
    <div class="TopSkills">
        <h3 class="TopSkills-title">Top skills</h3>
        <ul v-if="skills.length > 0" class="TopSkills-skills">
            <li v-for="skill in skills"><span class="badge">{{skill.votes}}</span> {{skill.name}}</li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'top-skills',

    data: function(){
      return {skills: []}
    },

    mounted: function () {

      this.$http.get('/api/skills/top').then(
        (res) => {
            this.skills = res.body;
        },
        (res) => {
          // error

        }

      );
    }
  }
</script>

<style  lang="scss">
    .TopSkills {
        height: 300px;
        background-color: #FFFFFF;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
        margin: 55px auto;
        max-width:200px;
    }

    .TopSkills-title {
        text-align: center;
        padding-top: 10px;
        margin-bottom: 30px;
        font-family: 'Poller One', cursive;
    }

    .TopSkills-skills {
        list-style: none;
    }
</style>
