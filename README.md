# Short URL

A URL shortener in Node with RethinkDB & Express.

### Install

1. [Get Node.js](https://nodejs.org)
2. [Get RethinkDB](http://rethinkdb.com/)
3. Clone this repo `$ git clone https://github.com/bentranter/short-url.git && cd short-url`
4. Install dependencies `$ npm install`
5. Start RethinkDB `$ rethinkdb`
6. Start the URL shortener `$ npm start`

### Usage

There are only two methods:

###### Create a new shortened URL

Send a POST request to `http://127.0.0.1:3000/<url-to-shorten->`, where `<url-to-shorten>` follows either `www.something.com` or `something.com`. **Do not include the `http://`**, it will upset the shortener.

You'll get a JSON response with your shortened URL.

###### Access a URL that has been shortened

Send a GET request to `http://127.0.0.1:3000/<short-url>`, where `<short-url>` is the 8 character string of garbage that your link has become. It'll redirect to the orginal URL.

###### Changing the base URL

Just go into `index.js` and change the variable `baseURL` (on line 16) to whatever you need it to be (ie, your domain).

### Tests

Follow the steps in 1 - 6 from **Install**, and then run `$ npm test`. Tests are run with Mocha.

### License

MIT &copy; 2015 Ben Tranter