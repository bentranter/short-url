// Module dependencies
var request = require('supertest');

// URL to run the tests against
var url = '127.0.0.1:3000';

// Generated link
var link = '';

describe('url shortener', function() {

  it('should shorten the url', function(done) {
    request(url)
      .post('/www.google.com')
      .expect(201)
      .end(function(err, res) {
        if (err)
          return done(err);
        link = res.body.link;
        done();
      });
  });

  it('should redirect to the original url', function(done) {
    request(link)
      .get('/')
      .expect(302)
      .end(function(err, res) {
        if (err)
          return done(err);
        done();
      });
  });
});