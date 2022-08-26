const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(express.static(path.join(__dirname, 'public')));
// 세션세팅
app.use(
  session({
    secret: "webtoon-moa",
    resave: true,
    saveUninitialized: true,
  })
);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const webtoonRouter = require('./routes/webtoon');
const favoritesRouter = require('./routes/favorites');
const oauthRouter = require('./routes/oauth');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/webtoon', webtoonRouter);
app.use('/favorites', favoritesRouter);
app.use('/auth', oauthRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000);

module.exports = app;
