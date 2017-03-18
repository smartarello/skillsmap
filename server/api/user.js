let database = require('../utils/database');

module.exports = {
  getUser(req, res) {
    console.log("Call getUser");

    if (!req.query.username) {
      res.status(403).send();
      return ;
    }

    database.select("SELECT * FROM users  WHERE users.username = ?", [req.query.username], function(err, results){
      if (!results || results.length == 0) {
        res.status(404).send();
        return;
      }

      let user = results[0];
      database.select("SELECT skills.name, count(*) as votes FROM skills INNER JOIN users_has_skills ON users_has_skills.skill_id = skills.id LEFT JOIN users_votes ON users_votes.users_has_skills_id = users_has_skills.id WHERE users_has_skills.user_id = ? GROUP BY skills.id ORDER BY votes DESC", [user.id], function(err, results){
          let skills = [];
          for (let i = 0; i < results.length; i++) {
            skills.push({name: results[i].name, votes: results[i].votes});
          }

          user.skills = skills;

          res.status(200).send(user);

      });
    });
  },

  get(req, res) {
    console.log("Call on /people");
    database.select("SELECT users.username, users.name, users.firstname, job_title, picture, GROUP_CONCAT(skills.name) as skills FROM users LEFT JOIN users_has_skills ON users_has_skills.user_id = users.id LEFT JOIN skills ON skills.id = users_has_skills.skill_id GROUP BY users.id",
      function(error, results){
        if (error) {
          console.log(error);
          res.status(500).send();
          return ;
        }

        let users = [];
        for (let i = 0; i < results.length; i++) {
          let row = results[i];
          let skills = [];
          let user = {username: row.username, name: row.name, firstname: row.firstname, jobTitle: row.job_title};
          if (row.skills) {
            skills = row.skills.split(',');
          }

          user.skills = skills;

          if (row.picture) {
            user.picture = row.picture;
          } else {
            user.picture = '/assets/images/user.png';
          }

          users.push(user);
        }

        res.status(200).send(users);
      });

  }
};