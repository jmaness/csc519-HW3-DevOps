const express = require('express');
const app = express();

const multer = require('multer');
const fs = require('fs');
const util = require('util');

// REDIS
const redis = require('redis');
let client = redis.createClient(6379, '127.0.0.1', {});
const clientLpush = util.promisify(client.lpush).bind(client);
const clientLtrim = util.promisify(client.ltrim).bind(client);

const recentKey = 'recent';

///////////// GLOBAL HOOK

// Add hook to make it easier to get all visited URLS.
app.use(async function (req, res, next) {
  console.log(req.method, req.url);

  // Task 2
  // Store recent routes
  if (req.url !== '/recent') {
    await clientLpush(recentKey, req.url);
    await clientLtrim(recentKey, 0, 4);
  }

  next(); // Passing the request to the next handler in the stack.
});

///////////// WEB ROUTES

// responding to GET request to / route (http://IP:3000/)
app.get('/', function (req, res) {
  res.send('hello world')
})

app.get('/test', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.write('test');
  res.end();
})

// Task 1 ===========================================
// Create two routes, `/get` and `/set`.

app.get('/get', function(req, res) {
    var key = req.query.key;
    client.get(key, function(err, value) {
        res.send(value);
    });
});

app.get('/set', function(req, res) {
    var key = req.query.key;
    var expireTime = 10;
    var value = `this message will self-destruct in ${expireTime} seconds`

    client.set([key, value, 'EX', expireTime], function(err, reply) {
        res.status(204);
	      res.end();
    });
});

// ===================================================


// Task 2 ============================================

// Create a new route, `/recent`
app.get('/recent', function(req, res) {
    var key = 'recent';
    client.lrange([key, 0, 4], function(err, value) {
        res.send(JSON.stringify(value));
    });
});

// ===================================================


// Task 3 ============================================
const upload = multer({ dest: './uploads/' })
app.post('/upload', upload.single('image'), function (req, res) {
  console.log(req.body) // form fields
  console.log(req.file) // form files

  if (req.file.fieldname === 'image') {
    fs.readFile(req.file.path, function (err, data) {
      if (err) throw err;
      var img = new Buffer(data).toString('base64');
      console.log(img);

      client.lpush('cats', img, function (err) {
        res.status(204).end()
      });
    });
  }
});

app.get('/meow', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/html' });

  // res.write("<h1>\n<img src='data:my_pic.jpg;base64," + imagedata + "'/>");
  res.end();
})
// ===================================================

// HTTP SERVER
let server = app.listen(3003, function () {

  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
})
