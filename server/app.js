let express = require('express');
let sqlite3 = require("sqlite3").verbose();
let fs = require('fs');
let app = express();
let session = require('express-session');
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


let router = express.Router();
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let filename = './database.db';
var exists = fs.existsSync(filename);
if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(filename, "w");
}

let db = new sqlite3.Database(filename);

db.serialize(function() {
  if(!exists) {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, name TEXT, firstname TEXT, job_title TEXT, twitter TEXT, website TEXT, picture TEXT)");
    db.run("CREATE TABLE skills (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
    db.run("CREATE TABLE users_has_skills (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE, vote INTEGER)");
    db.run("CREATE UNIQUE INDEX idx_users_has_skills ON users_has_skills (user_id,skill_id)");
    db.run("CREATE UNIQUE INDEX idx_username ON users (username)");
    db.run("CREATE INDEX idx_skillname ON skills (name)");

    // // creates fake data for test
    // for (let i = 0; i < 12; i++) {
    //   db.run("INSERT INTO users (username, name, firstname, job_title) VALUES ('stephane.martarello"+i+"@crossknowledge.com', 'Martarello"+i+"', 'Stéphane', 'Développeur')");
    // }
    //
    // db.run("INSERT INTO skills (name) VALUES ('Symfony')");
    // db.run("INSERT INTO skills (name) VALUES ('NodeJS')");
    // db.run("INSERT INTO skills (name) VALUES ('VueJS')");
    // db.run("INSERT INTO skills (name) VALUES ('PHP')");
    // db.run("INSERT INTO skills (name) VALUES ('Javascript')");
    // db.run("INSERT INTO skills (name) VALUES ('MySQL')");
    //
    // db.run("INSERT INTO users_has_skills (user_id, skill_id) VALUES (1, 1)");
    // db.run("INSERT INTO users_has_skills (user_id, skill_id) VALUES (1, 2)");
    // db.run("INSERT INTO users_has_skills (user_id, skill_id) VALUES (2, 3)");
    // db.run("INSERT INTO users_has_skills (user_id, skill_id) VALUES (2, 1)");

  }
});



db.close();

router.get('/getOAuthUrl', LoginApi.getOAuthUrl);
router.get('/login', LoginApi.login);

router.get('/people', function(req, res){

  console.log("Call on /people");
  
  req.session.test = 'true';

  let db = new sqlite3.Database(filename);
  let users = [];
  db.each("SELECT users.name, users.firstname, job_title, picture, GROUP_CONCAT(skills.name) as skills FROM users LEFT JOIN users_has_skills ON users_has_skills.user_id = users.id LEFT JOIN skills ON skills.id = users_has_skills.skill_id GROUP BY users.id", function(err, row) {
      let skills = [];
      if (row.skills) {
        skills = row.skills.split(',');
      }
      req.session.user = {name: row.name, firstname: row.firstname, jobTitle: row.job_title, picture: '/assets/images/user.png', skills: skills};
      if (row.picture) {
        req.session.user.picture = row.picture;
      }

      users.push(req.session.user);
  }, function(){
    res.status(200).send(users);
  });

  db.close();
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

let server = app.listen(80, function() {
  console.log('Express server listening on port 80');
});
