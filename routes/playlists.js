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

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

const api = express.Router();
api.use(cookieParser())
//GET all playlists

api.get('/', function(req, res,next){

  try{
    const token = parseCookies(req);
    const decoded = jwt.verify(token['access_token'], process.env.JWT_SECRET);
    const access_token = decoded['token'];

      spotifyApi.setAccessToken(access_token)
 spotifyApi.getUserPlaylists().then(function(data){
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




//GET one playlist /playlists/:id
api.get('/:id',function(req, res,next){

  try{
    const token = parseCookies(req);
    const decoded = jwt.verify(token['access_token'], process.env.JWT_SECRET);
    const access_token = decoded['token'];

  const playlistId = req.params.id;

      spotifyApi.setAccessToken(access_token)
        spotifyApi.getPlaylistTracks(playlistId)
        .then(function(data) {
      res.send({data: data.body});

   })
    .catch(function(err) {
      console.log('Something went wrong:', err.message);
    });
  return res.status(200);
  next();
  } catch(err){
  res.status(400).send(err);
  }
  });


//POST playlist
api.post('/:name', function(req, res,next){

  try{
    const token = parseCookies(req);
    const decoded = jwt.verify(token['access_token'], process.env.JWT_SECRET);
    const access_token = decoded['token'];


  var name = req.params.name;


      spotifyApi.setAccessToken(access_token)
      spotifyApi.createPlaylist(name)
    .catch(function(err) {
      console.log('Something went wrong:', err.message);
    });
    res.status(201).send({msg: "playlist created"});
    next();
  } catch(err){
  res.status(400).send(err);
  }


});
//
//xm1gVprIQAOTK4kWU-KglQ
//rapUSR 4hxHBTUERJ4bba9FsxZZgN

//POST /playlist/:id
api.post('/song/:playlistid', function(req, res,next){
  try{
    const token = parseCookies(req);
    const decoded = jwt.verify(token['access_token'], process.env.JWT_SECRET);
    const access_token = decoded['token'];

    var playlistId = req.params.playlistid;
    var track = req.query['track'];

      spotifyApi.setAccessToken(access_token)
       spotifyApi.addTracksToPlaylist(playlistId,[track],
        {
          position: 0
        }
      )
    .then(function(data) {
      console.log('Added tracks to the playlist!');
      res.status(201).send({msg: "track was added"});
    })
    .catch(function(err) {
      console.log('Something went wrong:', err.message);

    });
  }catch(err){
    res.status(400).send(err);
  }
});
//s



// DELETE /playlists/:id
api.delete('/:playlistId', function(req, res,next){
  try{

    const token = parseCookies(req);
    const decoded = jwt.verify(token['access_token'], process.env.JWT_SECRET);
    const access_token = decoded['token'];

    const playlistId = req.params.playlistId;
    const track = req.query['track'];

    spotifyApi.setAccessToken(access_token)
    spotifyApi.removeTracksFromPlaylist(playlistId,[{uri:track}])
  .then(function(data) {
    console.log('deleted');
    res.status(200).send({msg: "deleted track from playlist"});

  })
  .catch(function(err) {
    console.log('Something went wrong:', err.message);

  });


}catch(err){
  res.status(400).send(err);
}
});


module.exports=api;
