const express = require('express');
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const loginRoute = require('./routes/authsp');
const playlistsRoute = require('./routes/playlists');
const app = express();
const callbackRoute = require('./routes/callback');
const refreshTokenRoute = require('./routes/refreshToken');
const meRoute = require('./routes/me');
const authRoute = require('./routes/auth');
const verify = require('./verifyToken');

// db connection
mongoose.connect(process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true }, () => console.log('DB connection established'));


app.use(cookieParser())
//app.use(express.static(__dirname + '/public'));
//app.set('view engine', 'pug');
//app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function parseCookies (request) {
      var list = {},
          rc = request.headers.cookie;

      rc && rc.split(';').forEach(function( cookie ) {
          var parts = cookie.split('=');
          list[parts.shift().trim()] = decodeURI(parts.join('='));
      });

      return list;
  }

//routes login
app.use('/api/auth',loginRoute);

//routes callback
app.use('/callback',callbackRoute);
//user
app.use('/api/users', authRoute);


app.use(function(req, res, next) {
     res.header('Access-Control-Allow-Origin', req.headers.origin);
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});

var corsOptions = {
    origin: '*',
    credentials: true };

app.use(cors(corsOptions));


app.get('/',verify,function(req, res,next) {
const cookies = parseCookies(req);
const decodedacces = jwt.verify(cookies['access_token'], process.env.JWT_SECRET);
    if(decodedacces['exp'] - decodedacces['iat']>0){


            // routes playlist
            app.use('/api/playlists',playlistsRoute);
            // routes refreshToken
            app.use('/api/refresh_token', refreshTokenRoute);
            //get me
            app.use('/api/me', meRoute);





    res.status(200).send({

        me: "to see your data : /api/me",
        refresh: "to refresh your token: /api/refresh_token",
        playlist1:"to see all: /api/playlists",
        playlist2: "to see tracks in specific playlist: api/playlists/:id",
        playlist3: "to add track to playlist: api/playlists/song/:playlistid?track",
        playlist4: "to create playlist: api/playlist/:name",
        playlist5: "to remove track from playlist: api/playlist/:playlistid?track",
              });


}
else{
  res.clearCookie('authcode');
  res.clearCookie('access_token');
  res.clearCookie('auth-token');
  res.clearCookie('refresh_token');
  res.clearCookie('refreshToken');
  res.status(401).send({msg:"Something was wrong with headers"});
}

})



module.exports = app;
