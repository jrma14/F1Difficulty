const express = require('express'),
    app = express(),
    passport = require('passport'),
    dotenv = require('dotenv'),
    GoogleStrategy = require('passport-google-oauth20')
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@f1difficultycalculator.g24tehi.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let user

app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'))

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/oauth2/redirect/google',
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

app.get('/login/google', passport.authenticate('google'));

app.get('/oauth2/redirect/google',
    passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
    function (req, res) {
        debugger
        res.auth = user.id
        res.authType = "google"
        res.redirect('/');
    });


app.use(checkAuth)

function checkAuth(req, res, next) {
    
    const user = req.user
    if(user){
        const authType = "google"//req.body.authType
        const validUser = client.db("users").collection(authType).findOne({id:user.id})
        if (!validUser) res.status(401).send({ error: "Authentication Required" })
        else {
            next()
        }
    } else{
        res.status(401).send({ error: "Authentication Required" })
    }
    
}

app.use((req, res, next) => {
    debugger
    console.log(req.url)
    console.log(req.method)
    next()
})

app.listen(process.env.PORT || 3000)