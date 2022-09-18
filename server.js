const { none } = require('@material-tailwind/html/theme/base/shadows');
const { SHA256, AES } = require('crypto-js');
const Base64 = require('crypto-js/enc-base64')
const { send } = require('process');
const CryptoJS = require('crypto-js')

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

// app.set('view engine','ejs')

app.use((req, res, next) => {
    // if(req.url == "/"){
        // console.log(req.method)
        // console.log(req.url)
    //     console.log(req.user)
    // }
    next()
})
// app.use(require('cookie-parser')());//might not be working because express-session automatically parses cookies
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));//automatically parses cookies
app.use(express.static(path.join(__dirname, 'public'), { index: false, extensions: ['html'] }));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    if (!req.url.includes('/login') && !req.url.includes('/create')) {
        if (req.user) {
            next()
        } else {
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
    function (username, password, done) {
        let coll = client.db("users").collection("custom")
        coll.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, {err: 'username', message: 'no user with that username'}); }
            let dec = AES.decrypt(user.password, process.env.AES)
            if (dec.toString(CryptoJS.enc.Utf8) !== Base64.stringify(SHA256(password))) { return done(null, false, {err: 'password', message: 'incorrect password'}); }
            return done(null, user);
        });
    }))

app.post('/login/username', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)
        if (!user) {
            req.session.loginFailed = info
            return res.redirect('/login')
        }

        req.logIn(user, err => {
            if (err) return next(err)
            return res.redirect('/')
        })
    })(req, res, next)
}
);

passport.use('create', new LocalStrategy({
    passReqToCallback: true
},
    function (req, username, password, done) {//must encrypt and decrypt
        let coll = client.db('users').collection('custom')
        let failed = false
        let message = ''
        coll.findOne({ username: req.body.username }, (err, user) => {
            if (user) {
                failed = true
                message = 'a user with that username already exists'
                return done(null, false, { err: 'username', message: message })
            } else {
                if (req.body.password !== req.body.confirmpassword) {
                    failed = true
                    message = 'passwords do not match'
                    return done(null, false, { err: 'password', message: message })
                } else {
                    let sha = Base64.stringify(SHA256(req.body.password))
                    let enc = AES.encrypt(sha, process.env.AES).toString()
                    // console.log('sha:', sha)
                    // console.log('enc',AES.decrypt(enc,process.env.AES).toString(CryptoJS.enc.Utf8))
                    let user = { username: req.body.username, password: enc }
                    coll.insertOne(user)
                    return done(null, user)
                }
            }
        })
    }
))

app.post('/create', function (req, res, next) {
    passport.authenticate('create', {
        successRedirect: '/',
    }, function (err, user, info) {
        if (!user) {
            ejs.renderFile('./public/create.ejs', { err: info.err, message: info.message }, {}, (err, template) => {
                if (err) {
                    throw err;
                } else {
                    res.end(template)
                }
            })
        } else {
            console.log(user)
            res.redirect('/')
        }
    }
    )(req, res, next);
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

app.get('/', (req, res, next) => {
    let coll = client.db('data').collection('preferences')
    coll.findOne({ userId: req.user._id }).then(pref => {
        if (pref) {
            if (pref.list) {
                res.redirect('/list')
            } else {
                res.redirect('/map')
            }
        } else {
            coll.insertOne({ userId: req.user._id, list: false })
            res.redirect('/map')
        }
    })
})


app.get('/create', (req, res) => {
    ejs.renderFile('./public/create.ejs', { err: 'none', message: 'none' }, {}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.end(template)
        }
    })
})

app.get('/login', (req, res) => {
    let info = req.session.loginFailed
    if(info && !info.err){
        info.err = 'missing'
    }
    ejs.renderFile('./public/login.ejs', info?info:{err:'none',message:'none'}, {}, (err, template) => {
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

app.get('/map', (req, res) => {
    ejs.renderFile('./protected/map.ejs', {}, {}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.end(template)
        }
    })
})

app.get('/list', (req, res) => {
    ejs.renderFile('./protected/list.ejs', {}, {}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.end(template)
        }
    })
})

app.listen(process.env.PORT || 3000)