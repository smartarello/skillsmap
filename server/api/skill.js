let database = require('../utils/database');

module.exports = {

  search(req, res) {

    let keyword = "";
    if (req.query.q) {
      keyword = req.query.q.trim();
    }

    let sql = "SELECT name from skills";
    if (keyword != "") {
      sql += " WHERE name LIKE ?";
    }

    database.query(sql, [keyword+'%'], function(err, results){
      if (err) {
        console.log(err);
        res.status(200).send([]);
      } else {
        let skills = [];
        for (let i = 0; i < results.length; i++) {
          skills.push({id: results[i].name, text: results[i].name });
        }

        res.status(200).send(skills);
      }
    });
  },

  vote(req, res){

    if (!req.body.user || !req.body.skill || !req.session.user) {
      res.status(403).send();
      return ;
    }

    let sql = "INSERT INTO users_votes (user_id, users_has_skills_id)" +
      "        SELECT ?, users_has_skills.id" +
      "        FROM users_has_skills" +
      "        INNER JOIN skills ON skills.id = users_has_skills.skill_id" +
      "        WHERE skills.name = ? AND users_has_skills.user_id = ?";

    database.query(sql, [req.session.user.id, req.body.skill, req.body.user]);
    res.status(200).send();
  },

  get(req, res){

    let start = 0;
    if (req.query.start) {
      start = parseInt(req.query.start);
    }



    let parameters = [];
    let sqlFilter = "";

    if (req.query.q && req.query.q != "") {
      sqlFilter = "WHERE skills.name LIKE ? ";
      parameters.push(req.query.q + '%');
    }

    parameters.push(start);

    let sqlSearch = "SELECT skills.id" +
      "              FROM skills" +
      "              INNER JOIN users_has_skills ON users_has_skills.skill_id = skills.id" +
      "              INNER JOIN users_votes ON users_votes.users_has_skills_id = users_has_skills.id" +
      "              INNER JOIN users ON users.id = users_has_skills.user_id " + sqlFilter +
      "              GROUP BY skills.id" +
      "              ORDER BY skills.name ASC" +
      "              LIMIT ?, 25";

    database.query(sqlSearch, parameters, function(error, results) {
      if (error) {
        console.log(error);
        res.status(500).send();
        return;
      }

      if (results.length == 0) {
        res.status(200).send([]);
        return;
      }

      let ids = [];
      for(let i = 0; i < results.length; i++) {
        ids.push(results[i].id);
      }

      let sql = "SELECT skills.id, users_has_skills.user_id, skills.name, users.name as username, users.firstname, users.picture, count(DISTINCT users_votes.id) as votes" +
        "        FROM skills" +
        "        INNER JOIN users_has_skills ON users_has_skills.skill_id = skills.id" +
        "        INNER JOIN users_votes ON users_votes.users_has_skills_id = users_has_skills.id" +
        "        INNER JOIN users ON users.id = users_has_skills.user_id" +
        "        WHERE skills.id IN ("+ ids.join(',') +") " +
        "        GROUP BY skills.id, users_has_skills.user_id" +
        "        ORDER BY skills.name ASC, votes DESC";

      database.query(sql, [], function(error, results){
        if (error) {
          console.log(error);
          res.status(500).send();
          return ;
        }

        let skills = {};
        for (let i = 0; i < results.length; i++) {
          let skill = results[i];

          if (typeof skills[results[i].name] == 'undefined') {
            skill.users = [];

            skills[results[i].name] = skill;
          }

          if (skills[results[i].name].users.length < 3) {

            let picture = '/assets/images/user.png';
            if (skill.picture) {
              picture = skill.picture;
            }

            skills[results[i].name].users.push({name: skill.username, firstname: skill.firstname, votes: skill.votes, picture: picture});
          }
        }

        let data = [];
        for (let key in skills) {
          if (skills.hasOwnProperty(key)) {
            data.push(skills[key]);
          }
        }

        res.status(200).send(data);
      });


    });
  },

  getTop(req, res){

    let sql = "SELECT skills.name, count(DISTINCT users_votes.id) as votes" +
      "              FROM skills" +
      "              INNER JOIN users_has_skills ON users_has_skills.skill_id = skills.id" +
      "              INNER JOIN users_votes ON users_votes.users_has_skills_id = users_has_skills.id" +
      "              GROUP BY skills.id" +
      "              ORDER BY votes DESC" +
      "              LIMIT 10";

    database.query(sql, [], function(error, results) {
      if (error) {
          console.log(error);
          res.status(500).send();
      } else {
          res.status(200).send(results);
      }
    });
  }
};
