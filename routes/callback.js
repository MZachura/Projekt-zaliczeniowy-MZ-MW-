var app = require('../app');
var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors');
dotenv.config()
const env = 'development';
var url = require('url');
var path = require('path');
var cookieParser = require('cookie-parser');
api = express.Router();
var jwt =require('jsonwebtoken');


var scope = 'user-read-private user-read-email';

var accessToken;
var scopes =
clientSecret= process.env.clientSecret,
clientId= process.env.clientId;

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: 'http://localhost:8080/callback'
});

var corsOptions = {
    origin: '*',
    credentials: true };

api.use(cors(corsOptions));

api.get('/',function(req,res, next){
  try{
    var q = url.parse(req.url, true);
    const authorizationCode = q.query['code']
    spotifyApi.authorizationCodeGrant(authorizationCode)
    .then(function(data){
    var access_token=jwt.sign({ token: data.body['access_token'] } ,process.env.JWT_SECRET, {expiresIn: 3600});
    var refresh_token=jwt.sign({ refresh: data.body['refresh_token'] } ,process.env.JWT_SECRET);
    res.cookie('access_token',access_token,{
       expiresIn: 3600 ,httpOnly: true
    });
    res.cookie('refresh_token',refresh_token,{
       httpOnly: true
    });
    res.redirect(302,'http://localhost:8080/');
})

} catch(err){
  res.status(400).send(err);
}});

module.exports = api;
