const SpotifyWebApi = require('spotify-web-api-node');
var express = require ('express');
const dotenv = require('dotenv');
dotenv.config()
const env = 'development';
var cookieParser = require("cookie-parser");
var  redirectUri= 'http://localhost:8080/callback';
var jwt =require('jsonwebtoken');

const spotifyApi = new SpotifyWebApi({
  //env
  clientId: process.env.clientId ,
  clientSecret: process.env.clientSecret ,
  redirectUri: redirectUri
});

const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];



const api = express.Router();
api.use(cookieParser());

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}


api.get('/' ,function(req,res,next){
      try{

        let tokenExpirationEpoch;
        const cookies = parseCookies(req);
        const decodedacces = jwt.verify(cookies['access_token'], process.env.JWT_SECRET);
        const decodedrefresh = jwt.verify(cookies['refresh_token'], process.env.JWT_SECRET);

        // First retrieve an access token

            spotifyApi.setAccessToken(decodedacces['token']);
            spotifyApi.setRefreshToken(decodedrefresh['refresh']);


            // Save the amount of seconds until the access token expired
            tokenExpirationEpoch =
              new Date().getTime() / 1000 + (decodedacces['exp'] - decodedacces['iat']);
            console.log(
              'Retrieved token. It expires in ' +
                Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                ' seconds!'
            );




        // Continually print out the time left until the token expires..
        let numberOfTimesUpdated = 0;

        setInterval(function() {
          console.log(
            'Time left: ' +
              Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
              ' seconds left!'
          );

          // OK, we need to refresh the token. Stop printing and refresh.
          if (++numberOfTimesUpdated > 5) {
            clearInterval(this);

            // Refresh token and print the new time to expiration.
            spotifyApi.refreshAccessToken().then(
              function(data) {
                tokenExpirationEpoch =
                  new Date().getTime() / 1000 + data.body['expires_in'];
                console.log(
                  'Refreshed token. It now expires in ' +
                    Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                    ' seconds!'
                );

                authorize = spotifyApi.createAuthorizeURL(scopes);
                res.redirect(authorize);
                res.status(200);
              },
              function(err) {
                console.log('Could not refresh the token!', err.message);
              }
            );
          }
        }, 1000);

  }catch(err){
  res.status(400).send(err);
}
});

module.exports = api;
