const express = require('express'),
    app = express(),
    passport = require('passport'),
    dotenv = require('dotenv'),
    GoogleStrategy = require('passport-google-oauth20')
const { MongoClient, ServerApiVersion } = require('mongodb')

dotenv.config();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@f1difficultycalculator.g24tehi.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



client.connect(err => {
  const collection = client.db("users").collection("users");
  // perform actions on the collection object
  client.close();
});

app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'))

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/oauth2/redirect/google',
    scope: ['profile'],
    state: true
},
    function verify(accessToken, refreshToken, profile, cb) {//https://github.com/jaredhanson/passport-google-oauth2#configure-strategy
       
    }
));

app.get('/login/google', passport.authenticate('google'));

app.get('/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
  });

app.use(function (req, res) {
    console.log(req.url)
    console.log(req.method)
})

app.listen(process.env.PORT || 3000)