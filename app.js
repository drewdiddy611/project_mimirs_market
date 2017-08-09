var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var exphbs = require('express-handlebars');

const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

var app = express();
require('dotenv').config();

// connect to mongoose
// app.use((req, res, next) => {
// 	if (moongoose.connection.readyState) {
// 		next();
// 	} else {
// 		mongoose
// 			.createConnection(process.env.DB_URL, {
// 				useMongoClient: true
// 			})
// 			.then(db => {
// 				console.log('DB CONNECTION SUCCESS');
// 				next();
// 			})
// 			.catch(err => {
// 				console.error(err);
// 			});
// 		next();
// 	}
// });

// view engine setup
app.engine(
	'handlebars',
	exphbs({
		defaultLayout: 'main'
	})
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiRoutes = require('./routes/api');
app.use('/', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
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

// app.listen(3000, () => {
// 	console.log('listening');
// });

module.exports = app;