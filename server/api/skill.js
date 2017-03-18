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

    database.select(sql, [keyword+'%'], function(err, results){
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
  }
};
