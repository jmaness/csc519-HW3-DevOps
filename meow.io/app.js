var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');
var factRouter = require('./routes/fact');

const util = require('util');
const db = require('./data/db');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1', {});
const clientLpush = util.promisify(client.lpush).bind(client);
const clientLtrim = util.promisify(client.ltrim).bind(client);
const clientLpop = util.promisify(client.lpop).bind(client);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/fact', factRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Process uploaded images
const uploadQueueKey = 'meow-upload-queue';
const uploadCacheKey = 'meow-recent-uploads';
setInterval(async function() { 
  var img = await clientLpop(uploadQueueKey);

  while (img) {
    await db.cat(img);
    await clientLpush(uploadCacheKey, img);
    await clientLtrim(uploadCacheKey, 0, 4);
    img = await clientLpop(uploadQueueKey);
  }
}, 100);

module.exports = app;
