var request = require('superagent');
var autodeskCredentials = require('./autodesk'); 
var fs = require('fs');

var requestCredentials = function() {

  var clientId = "yourClientId";
  var clientSecret = "yourClientSecret";

  request
    .post('https://developer.api.autodesk.com/authentication/v1/authenticate')
    .send({ 
      client_id: clientId, 
      client_secret: clientSecret,
      grant_type: "client_credentials",
      scope: "user-profile:read data:read data:write data:create data:search bucket:create bucket:read bucket:update bucket:update bucket:delete code:all account:read account:write"

    })
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .withCredentials()
    .end(function(err, res){
      if (err) { return console.log(err); }

      // given the response, update the autodesk token
      autodeskCredentials.accessToken = res.body.access_token;

      // make the outgoing file a module for continual i/o
      var autodeskFile =  "module.exports = ";
      autodeskFile += JSON.stringify(autodeskCredentials);

      fs.writeFile("./app/js/lib/autodesk.js", autodeskFile, function(err) {
        if(err) {
          return console.log(err);
        }
        console.log("Saved new autodesk credentials");
      });

    });
};

requestCredentials();