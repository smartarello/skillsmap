let database = require('../utils/database');

module.exports = {

  get(req, res) {

    console.log("Call /api/search/skill : "+req.query.q);

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
          skills.push(results[i].name);
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
  }
};
