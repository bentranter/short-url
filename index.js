// Module deps
var bodyParser = require('body-parser');
var emojiList = require('./emoji');
var express = require('express');
var multer  = require('multer');
var crypto = require('crypto');
var thinky = require('thinky')({
  host: 'localhost',
  port: '28015', // This is the default
  db: 'urlshort'
});

var app = express();

// Eexpress config
app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// Enable CORS for all endpoints
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD');
  res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// RethinkDB/Thinky refs
var type = thinky.type;
var r = thinky.r;

// Model
var Url = thinky.createModel('Url', {
  id: type.string().required(),
  link: type.string().required(),
  timesVisited: type.number().default(0),
  lastVisitedAt: type.date(),
  createdAt: type.date().default(r.now)
});

// Ensure index so we can `orderBy`
// `timesVisited`
Url.ensureIndex('timesVisited');

// Your URL shortener's URL
var baseURL = 'http://127.0.0.1:3000/';

/**
 * Gen random short string from a seed.
 *
 * @param {String} the name of the seed
 * @return {String} a random string
 */
function genLink() {
  // Seeds
  var seed = process.argv.slice(2)[0] ? process.argv.slice(2)[0] : 'hex';
  var len = process.argv.slice(2)[1] ? process.argv.slice(2)[1] : 8;

  // Generate random emoji string
  if (seed === 'emoji') {
    return genEmoji(len);
  }
  
  // Generate random base64 string
  if (seed.toLowerCase === 'base64') {
    return  crypto.randomBytes(Math.ceil(len * 3/4))
      .toString('base64')
      .slice(0, len)
      .replace(/\+/g, '0')
      .replace(/\//g, '0');
  }

  // Default is hex
  else {
    return crypto.randomBytes(Math.ceil(len/2))
    .toString('hex')
    .slice(0, len);
  }
}

/**
 * Generate a random string of emojis.
 *
 * @param {Int} the length of the
 * random string
 * @return {String} the random emoji
 * string
 */
function genEmoji(len) {
  var emojiArr = [];
  var i;
  for (i = 0; i < len; i++) {
    emojiArr[i] = emojiList[randomEmoji()];
  }
  return emojiArr.join('');
}

/**
 * Generate a random number between 1
 * and the length of the emoji list.
 *
 * @return the random number
 */
function randomEmoji() {
  return Math.floor(Math.random() * (emojiList.length));
}

// Endpoints
app.get('/', function(req, res) {
  res.json({
    link_url: baseURL + ':link'
  });
});

app.get('/stats', function(req, res) {
  Url.orderBy(r.desc('timesVisited'))
    .run()
    .then(function(docs) {
      res.json(docs);
    }).error(function(err) {
      res.status(400).json({ error: err });
    });
});

app.post('/:link', function(req, res) {
  var link = genLink();

  Url.save({
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
  Url.get(req.params.link)
    .update({
      timesVisited: r.row('timesVisited').add(1),
      lastVisitedAt: r.now()
    })
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
