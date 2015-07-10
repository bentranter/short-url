# Short URL

A URL shortener in Node with RethinkDB & Express.

### Install

1. [Get Node.js](https://nodejs.org)
2. [Get RethinkDB](http://rethinkdb.com/)
3. Clone this repo `$ git clone https://github.com/bentranter/short-url.git && cd short-url`
4. Install dependencies `$ npm install`
5. Start RethinkDB `$ rethinkdb`
6. Start the URL shortener `$ node index.js <linkType> <length>`

Confused by the arguments that come after `$ node index.js`? See the *usage* section below.

### Usage

When you start the server by running `$ node index.js`, you can optionally add two arguments. The first argument decides how the short URLs should appear. It can either be `hex`, `base64`, or `emoji`. The second argument decides how long the string that is your short URL is.

For example, if ran `$ node index.js base64 12`, your URLs will look something like `http:<yourdomain.com>/90e524b77bb0`. If you ran `$ node index.js emoji 5`, they'll look something like `http://<yourdomain.com>/😨😨😰😧😊`.

To **create a shortened URL**, send a POST request to `http://127.0.0.1:3000/<url-to-shorten>`, where `<url-to-shorten>` follows either `www.something.com` or `something.com`. **Do not include the `http://`**, it will upset the shortener. You'll get a JSON response with your shortened URL.

To **access a URL that has been shortened**, send a GET request to `http://127.0.0.1:3000/<short-url>`, where `<short-url>` is the 8 character string of garbage that your link has become. It'll redirect to the orginal URL.

#### Changing the base URL

Just go into `index.js` and change the variable `baseURL` (on line 16) to whatever you need it to be (ie, your domain).

### Tests

Follow the steps in 1 - 6 from **Install**, and then run `$ npm test`. Tests are run with Mocha.

### License

MIT &copy; 2015 Ben Tranter