// Module deps
var bodyParser = require('body-parser');
var express = require('express');
var multer  = require('multer');
var crypto = require('crypto');
var thinky = require('thinky')({
  host: 'localhost',
  port: '28015', // This is the default
  db: 'urlshort'
});

var app = express();

// Your URL shortener's URL
var baseURL = 'http://127.0.0.1:3000/';

// RethinkDB/Thinky refs
var type = thinky.type;

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
var Url = thinky.createModel('Url', {
  id: type.string().required(),
  link: type.string().required()
});

// Gen random short string
function genLink() {
  return crypto.randomBytes(Math.ceil(8/2))
    .toString('hex')
    .slice(0, 8);
}

// Endpoints
app.get('/', function(req, res) {
  res.json({
    link_url: baseURL + ':link'
  });
})

app.post('/:link', function(req, res) {
  var link = genLink();

  Url
    .save({
      id: link,
      link: req.params.link
    })
    .then(function(doc) {
      res.status(201).json({ link: baseURL + doc.id });
    })
    .error(function(err) {
      res.status(400).json({ error: err });
    });
});

app.get('/:link', function(req, res) {

  Url
    .get(req.params.link)
    .run()
    .then(function(doc) {
      res.redirect('http://' + doc.link);
    })
    .error(function(err) {
      res.status(400).json({ error: err });
    });
});

app.listen(3000, function() {
  console.log('Express started on port 3000');
});
