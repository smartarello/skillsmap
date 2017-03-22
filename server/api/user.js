let database = require('../utils/database');

module.exports = {
  getUser(req, res) {

    database.query("SELECT * FROM users  WHERE users.username = ?", [req.query.username], function(err, results){
      if (!results || results.length == 0) {
        res.status(404).send();
        return;
      }

      let user = results[0];
      if (!user.picture || user.picture == ""){
        user.picture = '/assets/images/user.png';
      }

      database.query("SELECT skills.name, count(DISTINCT users_votes.id) as votes, GROUP_CONCAT(users_votes.user_id) as userIds FROM skills INNER JOIN users_has_skills ON users_has_skills.skill_id = skills.id LEFT JOIN users_votes ON users_votes.users_has_skills_id = users_has_skills.id WHERE users_has_skills.user_id = ? GROUP BY skills.id ORDER BY votes DESC", [user.id], function(err, results){
          let skills = [];
          for (let i = 0; i < results.length; i++) {
            let userIds = [];
            if (results[i].userIds) {
              userIds = results[i].userIds.split(',');
            }
            skills.push({name: results[i].name, votes: results[i].votes, userIds:userIds});
          }

          user.skills = skills;

          res.status(200).send(user);

      });
    });
  },

  get(req, res) {

    let start = 0;
    if (req.query.start) {
      start = parseInt(req.query.start);
    }

    let parameters = [];
    let sqlFilter = "";

    if (req.query.q && req.query.q != "") {
      sqlFilter = "WHERE users.name LIKE ? OR users.firstname LIKE ? OR skills.name LIKE ? ";
      parameters.push(req.query.q + '%');
      parameters.push(req.query.q + '%');
      parameters.push(req.query.q + '%');
    }

    parameters.push(start);

    let sqlSearch = "SELECT users.id " +
      "                            FROM users" +
      "                            LEFT JOIN users_has_skills ON users_has_skills.user_id = users.id " +
      "                            LEFT JOIN skills ON skills.id = users_has_skills.skill_id " +  sqlFilter +
      "                            GROUP BY users.id" +
      "                            ORDER BY users.name ASC" +
      "                            LIMIT ?, 25";

    database.query(sqlSearch, parameters, function (error, results) {
      if (error) {
        console.log(error);
        res.status(500).send();
        return ;
      }

      let ids = [];
        for(let i = 0; i < results.length; i++) {
          ids.push(results[i].id);
        }

      let sql = "SELECT users.*, skills.name as skill, count(DISTINCT users_votes.id) as votes" +
        "        FROM users " +
        "        LEFT JOIN users_has_skills ON users_has_skills.user_id = users.id " +
        "        LEFT JOIN users_votes ON users_votes.users_has_skills_id = users_has_skills.id " +
        "        LEFT JOIN skills ON skills.id = users_has_skills.skill_id " +
        "        WHERE users.id IN ("+ ids.join(',') +") " +
        "        GROUP BY users.id, skills.name " +
        "        ORDER BY users.name ASC, votes DESC";

      database.query(sql,
        parameters,
        function(error, results){
          if (error) {
            console.log(error);
            res.status(500).send();
            return ;
          }

          let users = {};
          for (let i = 0; i < results.length; i++) {
            let user = results[i];

            if (typeof users[results[i].username] == 'undefined') {
              user.skills = [];
              if (!user.picture) {
                user.picture = '/assets/images/user.png';
              }

              users[results[i].username] = user;
            }

            if (user.skill != null && users[results[i].username].skills.length < 3) {
              users[results[i].username].skills.push({name: user.skill, votes: user.votes});
            }
          }

          let data = [];
          for (let key in users) {
            if (users.hasOwnProperty(key)) {
              data.push(users[key]);
            }
          }

          res.status(200).send(data);
        });

    });




  },

  save(req, res){
    if (!req.body.user) {
      res.status(500).send();
      return ;
    }

    let user = req.body.user;
    let newSkills = [];
    for (let i = 0; i < user.skills.length; i++) {
      newSkills.push(user.skills[i].name);
    }

    let sql = "UPDATE users SET job_title = ?, twitter = ?, website = ? WHERE id = ?";
    database.query(sql, [user.job_title, user.twitter, user.website, user.id], function(){

      database.query("SELECT skills.name, skills.id FROM skills INNER JOIN users_has_skills ON users_has_skills.skill_id = skills.id WHERE users_has_skills.user_id = ?",
      [user.id],
      function(err, results){

        let skillsToAdd = [];
        let skillsToRemove = [];
        let currentSkills = [];

        for (let i = 0; i < results.length; i++) {
          currentSkills.push(results[i].name);
          if (newSkills.indexOf(results[i].name) == -1) {
            skillsToRemove.push(results[i].id);
          }
        }

        let insertSql = "INSERT IGNORE INTO skills (name) VALUES ";
        let valuesToInsert = [];
        for (let i = 0; i < newSkills.length; i++) {
          if (currentSkills.indexOf(newSkills[i]) == -1) {
            skillsToAdd.push("'" + newSkills[i] + "'");
            valuesToInsert.push("('"+newSkills[i]+"')");
          }
        }

        if (valuesToInsert.length > 0) {
          insertSql += valuesToInsert.join(",");
          database.query(insertSql, [], function(){
            let insertUsersHasSkills = "INSERT IGNORE INTO users_has_skills (skill_id, user_id) SELECT skills.id, ? FROM skills WHERE skills.name IN ("+ skillsToAdd.join(',')  +")";
            database.query(insertUsersHasSkills, [user.id], function(){
              if (skillsToRemove.length > 0){
                database.query("DELETE FROM users_has_skills WHERE user_id = ? AND skill_id IN ("+ skillsToRemove.join(',') +")", [user.id]);
              }

              res.status(200).send();
            });
          });
        } else if (skillsToRemove.length > 0){
            database.query("DELETE FROM users_has_skills WHERE user_id = ? AND skill_id IN ("+ skillsToRemove.join(',') +")", [user.id]);
        } else {
          res.status(200).send();
        }
      });


    });


  }
};