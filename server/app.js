let express = require('express');
let app = express();

let router = express.Router();
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/people', function(req, res){
  res.status(200).send([
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},
    {'name' : 'Martarello', 'firstname' : 'Stéphane', 'jobTitle' : 'Developper', 'picture' : '/assets/images/user.png', 'skills' : ['Symfony', 'VueJs', 'NodeJs']},

  ]);
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



let server = app.listen(3000, function() {
  console.log('Express server listening on port 3000');
});
