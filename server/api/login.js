module.exports = {
  getOAuthUrl(req, res){
    console.log("Call getOAuthUrl");
    console.log(req.session);
    if (req.session.user) {
      res.status(200).send({alreadyConnected: true});
      return ;
    }


    let google = require('googleapis');
    let OAuth2 = google.auth.OAuth2;

    let oauth2Client = new OAuth2(
      "963105479216-9jebphqd6p6h2d2gojla0skekam40lfh.apps.googleusercontent.com",
      "fVHRnBxxAPOVJ6z62IkuBVw-",
      "http://devcklstest.crossknowledge.com:8000"
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
    console.log(req.session);

    if (!req.query.code) {
        res.status(403).send();
    }

    let google = require('googleapis');
    let plus = google.plus('v1');
    let OAuth2 = google.auth.OAuth2;

    let oauth2Client = new OAuth2(
      "963105479216-9jebphqd6p6h2d2gojla0skekam40lfh.apps.googleusercontent.com",
      "fVHRnBxxAPOVJ6z62IkuBVw-",
      "http://devcklstest.crossknowledge.com:8000"
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
                picture = response.image.url;
                picture.replace('sz=50', 'sz=200');
              }

              let sqlite3 = require("sqlite3").verbose();
              let db = new sqlite3.Database("./database.db");

              db.serialize(function(){
                db.run("INSERT OR IGNORE INTO users (username, name, firstname, picture) VALUES ('"+email+"', '"+name+"', '"+firstname+"', '"+picture+"')");
              });

              res.status(200).send();
            }
        });
      } else {
        console.log(err);
      }
    });
  }
};
