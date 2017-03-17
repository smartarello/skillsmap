let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let app = express();
let session = require('express-session');
let mysql = require('mysql');

let config = require('./config.js');
let LoginApi = require('./api/login.js');

app.use(session({
    secret: 'egypmns4r8qp',
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true
    }
}));

app.use(express.static('web'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
      connection.query("CREATE TABLE IF NOT EXISTS users_has_skills (id INTEGER PRIMARY KEY AUTO_INCREMENT, user_id INTEGER, skill_id INTEGER, vote INTEGER, UNIQUE KEY `users_has_skills_idx` (user_id, skill_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE)");
  }
}) ;

//connection.end();

router.get('/getOAuthUrl', LoginApi.getOAuthUrl);
router.get('/login', LoginApi.login);

router.get('/people', function(req, res){

  console.log("Call on /people");
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

      connection.query("SELECT users.name, users.firstname, job_title, picture, GROUP_CONCAT(skills.name) as skills FROM users LEFT JOIN users_has_skills ON users_has_skills.user_id = users.id LEFT JOIN skills ON skills.id = users_has_skills.skill_id GROUP BY users.id",
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
            let user = {name: row.name, firstname: row.firstname, jobTitle: row.job_title};
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
  }) ;




});

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/api', router);

let server = app.listen(8000, function() {
  console.log('Express server listening on port 8000');
});
