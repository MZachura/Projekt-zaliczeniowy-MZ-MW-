const jwt = require('jsonwebtoken');
const express = require('express');
var cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());


function parseCookies (request) {
      var list = {},
          rc = request.headers.cookie;

      rc && rc.split(';').forEach(function( cookie ) {
          var parts = cookie.split('=');
          list[parts.shift().trim()] = decodeURI(parts.join('='));
      });

      return list;
  }


module.exports = function(req, res,next){
  const cookies = parseCookies(req);
    const token = cookies['auth-token'];
    if(!token) return res.status(401).send('Acces Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch(err){
        res.status(400).send('Invalid Token');
    }



}
