let mysql = require('mysql');
let config = require('../config');

module.exports = {
  /**
   *
   * @param  sql the SQL to execute
   * @param  data the data to inject in the SQL (parameters)
   * @param fn the callback which is executed after the SQL request
   */
  select(sql, data, fn) {

    let connection = mysql.createConnection({
      host     : config.mysql.host,
      user     : config.mysql.user,
      password : config.mysql.password,
      database : config.mysql.database
    });

    connection.connect((err) => {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      } else {
        if (!data) {
          data = [];
        }

        if (fn) {
          connection.query(sql, data, fn);
        } else {
          connection.query(sql, data);
        }
      }
    }) ;
  },

  createSchema(){

    let connection = mysql.createConnection({
      host     : config.mysql.host,
      user     : config.mysql.user,
      password : config.mysql.password,
      database : config.mysql.database
    });

    connection.connect((err) => {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      } else {
        connection.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTO_INCREMENT, username VARCHAR(255), name VARCHAR(255), firstname VARCHAR(255), job_title VARCHAR(255), twitter VARCHAR(255), website VARCHAR(255), picture VARCHAR(255), UNIQUE KEY `username` (username), INDEX(name(10)))");
        connection.query("CREATE TABLE IF NOT EXISTS skills (id INTEGER PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), UNIQUE KEY `skillname` (name))");
        connection.query("CREATE TABLE IF NOT EXISTS users_has_skills (id INTEGER PRIMARY KEY AUTO_INCREMENT, user_id INTEGER, skill_id INTEGER, UNIQUE KEY `users_has_skills_idx` (user_id, skill_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE)");
        connection.query("CREATE TABLE IF NOT EXISTS users_votes (id INTEGER PRIMARY KEY AUTO_INCREMENT, user_id INTEGER, users_has_skills_id INTEGER, UNIQUE KEY `users_votes_u_idx` (user_id, users_has_skills_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL, FOREIGN KEY (users_has_skills_id) REFERENCES users_has_skills(id) ON DELETE CASCADE)")
      }
    }) ;
  }
};
