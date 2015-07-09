// Module deps
var express = require('express');
var multer  = require('multer');
var bodyParser = require('body-parser');
var thinky = require('thinky')({
  host: 'localhost',
  port: '28015', // This is the default
  db: 'urlshort'
});

var app = express();

//Config
app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// Enable CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD');
  res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Model

// Endpoints
app.get('/', function(req, res) {
  res.json({ message: 'Yay' });
});

app.listen(3000, function() {
  console.log('Express started on 3000');
});