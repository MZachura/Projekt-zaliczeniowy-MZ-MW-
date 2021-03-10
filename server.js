const express = require('express');
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");



const port = 8080;
const app= require('./app');

const http = require('http');
const server = http.createServer(app);
console.log('Listening on 8080');
server.listen(port);
