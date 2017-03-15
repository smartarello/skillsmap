let express = require('express');
let app = express();

app.use(express.static('web'));

let server = app.listen(80, function() {
  console.log('Express server listening on port 80');
});
