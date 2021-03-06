const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const genuuid = require('shortid');
const methodOverride = require('method-override');

const exphbs = require('express-handlebars');

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const app = express();
const session = require('express-session');
app.use(
	session({
		genid: genuuid,
		secret: 'I like pickles',
		resave: false,
		saveUninitialized: true
	})
);
app.use(methodOverride('X-HTTP-Method-Override'));
require('dotenv').config();

//connect to mongoose
app.use((req, res, next) => {
	if (/^\/(?:api\/)?orders.*/i.test(req.path)) {
		if (mongoose.connection.readyState) {
			next();
		} else {
			mongoose
				.connect(process.env.DB_URL, {
					useMongoClient: true
				})
				.then(db => {
					console.log('Connected to mongo');
					next();
				})
				.catch(err => {
					console.error(err);
				});
		}
	} else {
		next();
	}
});

// Handlebar helpers.
let hbs = exphbs.create({
	defaultLayout: 'main',
	helpers: require('./helpers')
});

// view engine setup
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	if (req.session.cart !== undefined) {
		res.locals.userCart = req.session.cart;
	}
	next();
});

const apiRoutes = require('./routes/index');
app.use('/', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
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

module.exports = app;
