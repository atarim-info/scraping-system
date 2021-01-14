var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;

// Enables CORS
const cors = require('cors');
app.use(cors({ origin: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

app.post('/parse', (req, res) => {
  const body = req.body;
  const html = scraperFileReader("http://localhost:8000");

  const webPage = new WebPageRecord({
    url: body.url,
    html: html,
    timestamp: Date.now(),
  });

  webPage.save(webPage)
      .then((savedWebPage) => res.status(201).send(savedWebPage))
      .catch((err) => res.status(400).send(err));
});

const mongoose = require('mongoose');
const {WebPageRecord} = require("./webPageRecordModel");
const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI).then(() => {
  console.log('Listening on port: ' + PORT);
  app.listen(PORT);
});

module.exports = app;
