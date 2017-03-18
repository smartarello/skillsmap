let config = require('../config.js');

module.exports = {
  getOAuthUrl(req, res){
    console.log("Call getOAuthUrl");

    if (req.session.user) {
      res.status(200).send({user: req.session.user});
      return ;
    }


    let google = require('googleapis');
    let OAuth2 = google.auth.OAuth2;

    let oauth2Client = new OAuth2(
      config.google.clientId,
      config.google.secret,
      config.google.redirectUrl
    );

    // generate a url that asks permissions for Google+
    let scopes = [
      'https://www.googleapis.com/auth/plus.me',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    let url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',

      // If you only need one scope you can pass it as a string
      scope: scopes
    });

    res.status(200).send({googleUrl: url});
  },

  login(req, res){

    console.log('Call login');

    if (!req.query.code) {
        res.status(403).send();
    }

    let google = require('googleapis');
    let plus = google.plus('v1');
    let OAuth2 = google.auth.OAuth2;

    let oauth2Client = new OAuth2(
      config.google.clientId,
      config.google.secret,
      config.google.redirectUrl
    );

    oauth2Client.getToken(req.query.code, function (err, tokens) {
      if (!err) {
        oauth2Client.setCredentials(tokens);
        plus.people.get({
          userId: 'me',
          auth: oauth2Client
        }, function (err, response) {

            if (err){
              console.log(err);
              res.status(500).send();
            }else {

              if (!response.domain || response.domain != "crossknowledge.com" || !response.emails || response.emails.length == 0) {
                res.status(403).send();
                return ;
              }

              let email = response.emails[0].value;
              let name = response.name.familyName;
              let firstname = response.name.givenName;
              let picture = '';
              if (response.image.url) {
                picture = response.image.url.replace('sz=50', 'sz=200');
              }


              let mysql = require('mysql');
              let connection = mysql.createConnection({
                host     : config.mysql.host,
                user     : config.mysql.user,
                password : config.mysql.password,
                database : config.mysql.database
              });

              connection.connect((err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    connection.query("INSERT INTO users (username, name, firstname, picture) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)", [email, name, firstname, picture]);
                    req.session.user = {username: email, name: name, firstname: firstname, picture: picture};
                    res.status(200).send(req.session.user);
                  }
              });
            }
        });
      } else {
        console.log(err);
      }
    });
  }
};
