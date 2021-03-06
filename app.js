const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

// Enables CORS
const cors = require('cors');
app.use(cors({ origin: true }));

const mongoose = require('mongoose');
const {WebPageRecord} = require("./db/webPageRecordModel");
const {scraperFileReader, scraperLinksReader, scraperFileReaderAsync, scraperLinksReaderAsync} = require('./libs/scraper');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/parse', (req, res) => {
  const body = req.body;
  const url = body.url
  console.log("in /parse body.url = " + url);
  const html = scraperFileReader(url);
  const links = scraperLinksReader(html);
  const webPage = new WebPageRecord({
    url: url,
    page: html,
    links: links,
    timestamp: Date.now()
  });

  webPage.save(webPage)
      .then((savedWebPage) => res.status(201).send(savedWebPage))
      .catch((err) => res.status(400).send(err));
});

app.post('/parse_async', (req, res) => {
  const body = req.body;
  const url = body.url
  console.log("in /parse_async body.url = " + url);
  scraperFileReaderAsync(url)
      .then((html) => {
          scraperLinksReaderAsync(html)
              .then((links) => {
                  const webPage = new WebPageRecord({
                    url: url,
                    page: html,
                    links: links,
                    timestamp: Date.now()
                  });

                  webPage.save(webPage)
                      .then((savedWebPage) => res.status(201).send(savedWebPage))
                      .catch((err) => res.status(400).send(err));
              });
      });
});


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



mongoose.connect(DB_URI).then(() => {
  console.log('Listening on port: ' + PORT);
  // app.listen(PORT);
});

module.exports = app;
