const SpotifyWebApi = require('spotify-web-api-node');
var express = require ('express');
var authsp = require ('../controllers/authsp');
const dotenv = require('dotenv');
dotenv.config()
const env = 'development';
const spotifyApi = new SpotifyWebApi({

//env
  clientSecret:process.env.clientSecret,
  clientId: process.env.clientId
});

const api = express.Router();

  api.get('/' ,authsp.auth);

module.exports = api;
