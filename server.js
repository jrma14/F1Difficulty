const { send } = require('process');

const express = require('express'),
    app = express(),
    passport = require('passport'),
    dotenv = require('dotenv'),
    GoogleStrategy = require('passport-google-oauth20'),
    GitHubStrategy = require('passport-github2'),
    LocalStrategy = require('passport-local'),
    path = require('path'),
    { MongoClient, ServerApiVersion } = require('mongodb'),
    ejs = require('ejs')
dotenv.config()
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@f1difficultycalculator.g24tehi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.use((req, res, next) => {
    // console.log(req.method)
    // console.log(req.url)
    next()
})
// app.use(require('cookie-parser')());//might not be working because express-session automatically parses cookies
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));//automatically parses cookies
app.use(express.static(path.join(__dirname, 'public'), { index: false, extensions: ['html'] }));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    // debugger
    // console.log(req.user)
    if (!req.url.includes('/login')) {
        if (req.user) {
            next()
        } else {
            // console.log('not logged in')
            res.redirect('/login')
        }
    } else {
        next()
    }
})
app.use(express.static(path.join(__dirname, 'protected'), { index: false, extensions: ['html'] }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/auth/google/callback',
    scope: ['profile'],
    state: true
},
    function verify(accessToken, refreshToken, profile, cb) {//https://github.com/jaredhanson/passport-google-oauth2#configure-strategy
        let coll = client.db("users").collection("google")
        coll.findOne({ id: profile.id }).then(res => {
            if (res !== null) {
                user = res
                return cb(null, res)
            } else {
                user = { ...profile }
                coll.insertOne(user)
                return cb(null, user)
            }
        }).catch(err => cb(err))
    }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/login/auth/github/callback"
},
    function verify(accessToken, refreshToken, profile, cb) {//https://github.com/jaredhanson/passport-google-oauth2#configure-strategy
        let coll = client.db("users").collection("github")
        coll.findOne({ id: profile.id }).then(res => {
            if (res !== null) {
                user = res
                return cb(null, res)
            } else {
                user = { ...profile }
                coll.insertOne(user)
                return cb(null, user)
            }
        }).catch(err => cb(err))
    }
));

passport.use(new LocalStrategy(
    function (username, password, done) {//must encrypt and decrypt
        let coll = client.db("users").collection("custom")
        coll.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.password === password) { return done(null, false); }
            // console.log('Logged In')
            // console.log(user)
            return done(null, user);
        });
    }))

app.post('/login/username', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}),(req, res) => {
    console.log(req)
});

app.get('/login/google', passport.authenticate('google'));

app.get('/login/github', passport.authenticate('github'));

app.get('/login/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
    function (req, res) {
        res.redirect('/')
    });

app.get('/login/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/')
    })

app.get('/', (req, res) => {
    // console.log('getting /')
    // console.log(req.user)
    ejs.renderFile('./protected/index.ejs', { loginText: req.user ? 'logout' : 'login', loginAction: req.user ? '/logout' : '/login' }, {}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.end(template)
        }
    })
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) console.log
        res.redirect('/');
    });
})

app.listen(process.env.PORT || 3000)