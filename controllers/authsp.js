const dotenv = require('dotenv');
dotenv.config()
const env = 'development';
const SpotifyWebApi = require('spotify-web-api-node');

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
//env
var  redirectUri= 'http://localhost:8080/callback';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: redirectUri
});


var token =  require("../config/token");
var authorize;

module.exports = {

 async auth(req,res, next){
  try{

    spotifyApi.setAccessToken(token.accessToken);
     authorize = spotifyApi.createAuthorizeURL(scopes);
   res.redirect(authorize);
  res.status(200);
  } catch(err){
      res.status(400).send(err);
    }
  },



}
