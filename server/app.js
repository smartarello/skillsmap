let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let app = express();
let session = require('express-session');

let config = require('./config.js');
let database = require('./utils/database.js');
let LoginApi = require('./api/login.js');
let UserApi = require('./api/user.js');
let SkillApi = require('./api/skill.js');

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


database.createSchema();


router.get('/getOAuthUrl', LoginApi.getOAuthUrl);
router.get('/login', LoginApi.login);
router.get('/user', UserApi.getUser);
router.post('/user/save', UserApi.save);
router.get('/people', UserApi.get);
router.get('/skill/search', SkillApi.search);
router.get('/skills', SkillApi.get);
router.post('/skill/vote', SkillApi.vote);

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
