// express
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const PORT = process.env.PORT || 9000;

// request handlers
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const request = require('request');
const rp = require('request-promise');
const qs = require('querystring');
const cors = require('cors');
const recursive = require('recursive-readdir');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(cors());

// session & passport
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// database
const RedisStore = require('connect-redis')(session);
const db = require('./models');
const {User, GitHubOAuth, GoogleDriveOAuth, BoxOAuth} = db;

// session settings
app.use(session({
	store: new RedisStore(),
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// passport settings
passport.use(new LocalStrategy((username, password, done) => {
	User.findOne({where: {username}}).then(user => {
		if(user === null) {
			done(null, false, {message: 'bad username'});
		}else{
			bcrypt.compare(password, user.password).then(res => {
				if(res) done(null, user);
				else done(null, false, {message: 'bad password'});
			});
		}
	}).catch(err => console.log('error: ', err));
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(({id}, done) => {
	User.findOne({where: {id}})
		.then(user => done(null, user));
});

// standard response
const successJSON = {"success": true};
const failJSON = (msg) => ({"success": false, "error": msg});

// load helper functions
const helperDep = {bcrypt, saltRounds, User, successJSON, failJSON};
const helper = require('./helper')(helperDep);

// user routes
const userRoute = require('./routes/user');
const userRouteDep = {express, bcrypt, saltRounds, passport, User, helper};
app.use('/user', userRoute(userRouteDep));

// oauth2 route
const credentials = require('./.credentials');
const oauth2Route = require('./routes/oauth2');
const oauth2RouteDep = {
	express, request, rp, qs, recursive, helper, passport,
	credentials, User, GitHubOAuth, GoogleDriveOAuth, BoxOAuth,
};
app.use('/oauth2', oauth2Route(oauth2RouteDep));

// 404 route
app.get('/404', (req, res) => {
	res.send('404 Not Found');
});
app.use((req, res, next) => {
	res.redirect('/404');
	next();
});

// start express server
if(!module.parent) {
	app.listen(PORT, _ => {
		console.log(`You and Port: ${PORT} are connected like soulmates`);
	});
}
