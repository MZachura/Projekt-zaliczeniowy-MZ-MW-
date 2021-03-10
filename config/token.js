var SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');
dotenv.config()
const env = 'development';

var scopes =
clientSecret= process.env.clientSecret,
clientId= process.env.clientId;
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

spotifyApi.clientCredentialsGrant().then(
  function(data) {
 module.exports={ accessToken: data.body['access_token']};
  },
  function(err) {
    console.log(
      'Something went wrong when retrieving an access token',
      err.message
    );
  }
);
