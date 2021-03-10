var app = require('../app');
var express = require ('express');
const SpotifyWebApi = require('spotify-web-api-node');
const token = require('../config/token');
var  redirectUri= 'http://localhost:8080/callback';
var cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
dotenv.config()
const env = 'development';
var jwt =require('jsonwebtoken');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: redirectUri
});



const api = express.Router();
api.use(cookieParser())
//GET all playlists
api.get('/', function(req, res,next){

function parseCookies (request) {
      var list = {},
          rc = request.headers.cookie;

      rc && rc.split(';').forEach(function( cookie ) {
          var parts = cookie.split('=');
          list[parts.shift().trim()] = decodeURI(parts.join('='));
      });

      return list;
  }



  try{
    const token = parseCookies(req);
    const decoded = jwt.verify(token['access_token'], process.env.JWT_SECRET);
    const access_token = decoded['token'];
      spotifyApi.setAccessToken(access_token);

         spotifyApi.getMe()
    .then(function(data) {

     console.log(data.body);
     res.send({data: data.body});
   })
    .catch(function(err) {
      console.log('Something went wrong:', err.message);
    });
  return res.status(200);
  } catch(err){
  res.status(400).send(err);
  }
  });
module.exports=api;
