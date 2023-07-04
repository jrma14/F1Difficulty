const { SHA256, AES } = require('crypto-js');
const Base64 = require('crypto-js/enc-base64')
const { send } = require('process');
const CryptoJS = require('crypto-js')
const axios = require('axios')
const jsdom = require('jsdom');
const { data } = require('autoprefixer');
const favicon = require('serve-favicon');
const { query } = require('express');

const express = require('express'),
    app = express(),
    passport = require('passport'),
    dotenv = require('dotenv'),
    GoogleStrategy = require('passport-google-oauth20'),
    GitHubStrategy = require('passport-github2'),
    LocalStrategy = require('passport-local'),
    path = require('path'),
    { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'),
    ejs = require('ejs')
dotenv.config()
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@f1difficultycalculator.g24tehi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const defaultTheme = 'dracula'
console.log('Server Started!')

// app.use(require('cookie-parser')());//express-session automatically parses cookies
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')))// just caches it
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));//automatically parses cookies
app.use(express.static(path.join(__dirname, 'public'), { index: false, extensions: ['html'] }));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    console.log(req.url)
    if (!req.url.includes('/login') && !req.url.includes('/create')) {
        if (req.user) {
            next()
        } else {
            res.redirect('/login')
        }
    } else {
        if (req.user) {
            res.redirect('/')
        } else {
            next()
        }
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
    callbackURL: `${process.env.URL}/login/auth/google/callback`,
    scope: ['profile'],
    state: true
},
    function verify(accessToken, refreshToken, profile, cb) {//https://github.com/jaredhanson/passport-google-oauth2#configure-strategy
        let coll = client.db("users").collection("google")
        let prefs = client.db("data").collection("preferences")
        coll.findOne({ id: profile.id }).then(res => {
            if (res !== null) {
                user = res
                return cb(null, res)
            } else {
                defPref = { list: false, theme: defaultTheme }
                user = { ...profile, preferences: defPref, type: 'google' }
                coll.insertOne(user)
                return cb(null, user)
            }
        }).catch(err => cb(err))
    }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.URL}/login/auth/github/callback`
},
    function verify(accessToken, refreshToken, profile, cb) {//https://github.com/jaredhanson/passport-google-oauth2#configure-strategy
        let coll = client.db("users").collection("github")
        coll.findOne({ id: profile.id }).then(res => {
            if (res !== null) {
                user = res
                return cb(null, res)
            } else {
                defPref = { list: false, theme: defaultTheme }
                user = { ...profile, preferences: defPref, type: 'github' }
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
            if (!user) { return done(null, false, { err: 'username', message: 'no user with that username' }); }
            let dec = AES.decrypt(user.password, process.env.AES)
            if (dec.toString(CryptoJS.enc.Utf8) !== Base64.stringify(SHA256(password))) { return done(null, false, { err: 'password', message: 'incorrect password' }); }
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
                    defPref = { list: false, theme: defaultTheme }
                    let user = { username: req.body.username, password: enc, preferences: defPref, type: 'custom', id: ObjectId() }
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
            ejs.renderFile('./public/create.ejs', { theme: req.user ? req.user.preferences.theme : defaultTheme, err: info.err, message: info.message }, {}, (err, template) => {
                if (err) {
                    throw err;
                } else {
                    res.end(template)
                }
            })
        } else {
            // console.log(user)
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
    if (req.user.preferences.list) {
        res.redirect('/list')
    } else {
        res.redirect('/map')
    }
})


app.get('/create', (req, res) => {
    ejs.renderFile('./public/create.ejs', { theme: req.user ? req.user.preferences.theme : defaultTheme, err: 'none', message: 'none' }, {}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.end(template)
        }
    })
})

app.get('/login', (req, res) => {
    let info = req.session.loginFailed
    if (info && !info.err) {
        info.err = 'missing'
    }
    ejs.renderFile('./public/login.ejs', { err: info?.err, message: info?.message, theme: req.user ? req.user.preferences.theme : defaultTheme }, {}, (err, template) => {
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

app.get('/changetheme', (req, res) => {
    users = client.db('users').collection(req.user.type)
    req.user.preferences.theme = req.query.theme
    let { _id, ...rest } = req.user
    users.updateOne({ id: req.user.id }, { $set: rest })
    res.end()
})

app.get('/settings', (req, res) => {
    ejs.renderFile('./protected/settings.ejs', { theme: req.user ? req.user.preferences.theme : defaultTheme }, {}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.end(template)
        }
    })
})

app.get('/getdata', async (req, res) => {
    let tracks = ['Bahrain', 'Saudi Arabia', 'Australia', 'Italy(Imola)', 'United States(Miami)', 'Spain', 'Monaco', 'Azerbaijan', 'Canada', 'Great Britain', 'Austria', 'France', 'Hungary', 'Belgium', 'Netherlands', 'Italy(Monza)', 'Singapore', 'Japan', 'United States(Austin)', 'Mexico', 'Brazil', 'Abu Dhabi']
    let endpoints = ['bahrain', 'saudi_arabia', 'australia', 'imola', 'miami', 'spain', 'monaco', 'azerbaijan', 'canada', 'silverstone', 'austria', 'france', 'hungary', 'spa', 'netherlands', 'monza', 'singapore', 'japan', 'usa', 'mexico', 'brazil', 'abudhabi']
    let coll = client.db('data').collection('laptimes')
    let result = await coll.find({ userId: req.user.id }).toArray()
    result.forEach(e => {
        data[e.track] = e
    })
    let trackname = tracks[endpoints.indexOf(req.query.endpoint)]
    let lapData = data[req.query.endpoint]
    let html = `<div class='popup container w-full h-full p-1 text-accent-content'>
                    <div class='text-center'>
                    ${trackname}
                    </div>
                    <div class='flex mt-5'>
                        <div id='stats' class='w-1/2 flex flex-col items-center'>
                               <h1>
                               Time:
                               </h1> 
                               <h1 id='laptime'>
                               ${lapData ? lapData.laptime : 'no laptime'}
                               </h1>
                            <h1>
                                <h1>
                                Difficulty:
                                </h1> 
                                <h1 id='difficulty'>
                                ${lapData ? lapData.difficulty : 'no difficulty'}
                                </h1>
                            </h1>
                        </div>
                        <form class="flex flex-col w-1/2">
                            <input data-endpoint='${req.query.endpoint}' id="in" type="text" placeholder="1:14.123" class="lapTimeField w-full p-1 rounded-md text-neutral" pattern="[0-9]+:[0-9]+.[0-9]+">
                            <div class="flex">
                                <button id='popupbtn' class="btn btn-secondary btn-xs mt-5 ml-0 mr-auto">clear</button>
                                <button id='popupbtn' class="btn btn-secondary btn-xs mt-5 ml-auto mr-0">submit</button>
                            </div>
                        </form>
                    </div>
                </div>`
    res.end(JSON.stringify({ 'html': html }))
})

app.get('/map', async (req, res) => {
    users = client.db('users').collection(req.user.type)
    req.user.preferences.list = false
    let { _id, ...rest } = req.user
    users.updateOne({ id: req.user.id }, { $set: rest })


    let tracks = ['Bahrain', 'Saudi Arabia', 'Australia', 'Italy(Imola)', 'United States(Miami)', 'Spain', 'Monaco', 'Azerbaijan', 'Canada', 'Great Britain', 'Austria', 'France', 'Hungary', 'Belgium', 'Netherlands', 'Italy(Monza)', 'Singapore', 'Japan', 'United States(Austin)', 'Mexico', 'Brazil', 'Abu Dhabi']
    let flags = ['https://www.f1laps.com/static/icons/flags/BHR.736ec7e127a1.svg', 'https://www.f1laps.com/static/icons/flags/SAU.239857cafada.svg', 'https://www.f1laps.com/static/icons/flags/AUS.cab2eac60acd.svg', 'https://www.f1laps.com/static/icons/flags/ITA.612e617f5d72.svg', 'https://www.f1laps.com/static/icons/flags/USA.36ab476e5e55.svg', 'https://www.f1laps.com/static/icons/flags/ESP.36938bbe2779.svg', 'https://www.f1laps.com/static/icons/flags/MCO.6bb3a6ad42a9.svg', 'https://www.f1laps.com/static/icons/flags/AZE.aed905d7c8a1.svg', 'https://www.f1laps.com/static/icons/flags/CAN.ed3cd4b507f8.svg', 'https://www.f1laps.com/static/icons/flags/GBR.e5564902e264.svg', 'https://www.f1laps.com/static/icons/flags/AUT.7fc4e22077fa.svg', 'https://www.f1laps.com/static/icons/flags/FRA.968aaa24eeff.svg', 'https://www.f1laps.com/static/icons/flags/HUN.844eeb9e8fa1.svg', 'https://www.f1laps.com/static/icons/flags/BEL.49147ca6a068.svg', 'https://www.f1laps.com/static/icons/flags/NLD.f163721e679e.svg', 'https://www.f1laps.com/static/icons/flags/ITA.612e617f5d72.svg', 'https://www.f1laps.com/static/icons/flags/SGP.3d05a02d8a92.svg', 'https://www.f1laps.com/static/icons/flags/JPN.1f905d23af14.svg', 'https://www.f1laps.com/static/icons/flags/USA.36ab476e5e55.svg', 'https://www.f1laps.com/static/icons/flags/MEX.6ee1e6d4e6ac.svg', 'https://www.f1laps.com/static/icons/flags/BRA.a102e5631626.svg', 'https://www.f1laps.com/static/icons/flags/ARE.61f9f9f93387.svg', 'https://www.f1laps.com/static/icons/flags/PRT.70a47eede02a.svg', 'https://www.f1laps.com/static/icons/flags/CHN.7f8455b70734.svg']
    let endpoints = ['bahrain', 'saudi_arabia', 'australia', 'imola', 'miami', 'spain', 'monaco', 'azerbaijan', 'canada', 'silverstone', 'austria', 'france', 'hungary', 'spa', 'netherlands', 'monza', 'singapore', 'japan', 'usa', 'mexico', 'brazil', 'abudhabi']
    let coords = [[2140, 870], [2065, 905], [3060, 1575], [1775, 675], [850, 850], [1605, 705], [1690, 665], [2100, 815], [910, 635], [1635, 570], [1790, 610], [1660, 630], [1785, 590], [1830, 620], [1690, 560], [1800, 700], [2680, 1030], [2990, 745], [685, 800], [600, 875], [1115, 1240], [2170, 890]]
    let data = {}
    let coll = client.db('data').collection('laptimes')
    let result = await coll.find({ userId: req.user.id }).toArray()
    result.forEach(e => {
        data[e.track] = e
    })
    ejs.renderFile('./protected/map.ejs', { pfp: req.user.photos ? req.user.photos[0]?.value : '', coords: coords, endpoints: endpoints, theme: req.user ? req.user.preferences.theme : defaultTheme, tracks: tracks, flags: flags, data: data }, {}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.end(template)
        }
    })
})

app.get('/list', async (req, res) => {
    users = client.db('users').collection(req.user.type)
    req.user.preferences.list = true
    let { _id, ...rest } = req.user
    users.updateOne({ id: req.user.id }, { $set: rest })

    req.user.preferences.list = true
    let tracks = ['Bahrain', 'Saudi Arabia', 'Australia', 'Italy(Imola)', 'United States(Miami)', 'Spain', 'Monaco', 'Azerbaijan', 'Canada', 'Great Britain', 'Austria', 'France', 'Hungary', 'Belgium', 'Netherlands', 'Italy(Monza)', 'Singapore', 'Japan', 'United States(Austin)', 'Mexico', 'Brazil', 'Abu Dhabi']
    let flags = ['https://www.f1laps.com/static/icons/flags/BHR.736ec7e127a1.svg', 'https://www.f1laps.com/static/icons/flags/SAU.239857cafada.svg', 'https://www.f1laps.com/static/icons/flags/AUS.cab2eac60acd.svg', 'https://www.f1laps.com/static/icons/flags/ITA.612e617f5d72.svg', 'https://www.f1laps.com/static/icons/flags/USA.36ab476e5e55.svg', 'https://www.f1laps.com/static/icons/flags/ESP.36938bbe2779.svg', 'https://www.f1laps.com/static/icons/flags/MCO.6bb3a6ad42a9.svg', 'https://www.f1laps.com/static/icons/flags/AZE.aed905d7c8a1.svg', 'https://www.f1laps.com/static/icons/flags/CAN.ed3cd4b507f8.svg', 'https://www.f1laps.com/static/icons/flags/GBR.e5564902e264.svg', 'https://www.f1laps.com/static/icons/flags/AUT.7fc4e22077fa.svg', 'https://www.f1laps.com/static/icons/flags/FRA.968aaa24eeff.svg', 'https://www.f1laps.com/static/icons/flags/HUN.844eeb9e8fa1.svg', 'https://www.f1laps.com/static/icons/flags/BEL.49147ca6a068.svg', 'https://www.f1laps.com/static/icons/flags/NLD.f163721e679e.svg', 'https://www.f1laps.com/static/icons/flags/ITA.612e617f5d72.svg', 'https://www.f1laps.com/static/icons/flags/SGP.3d05a02d8a92.svg', 'https://www.f1laps.com/static/icons/flags/JPN.1f905d23af14.svg', 'https://www.f1laps.com/static/icons/flags/USA.36ab476e5e55.svg', 'https://www.f1laps.com/static/icons/flags/MEX.6ee1e6d4e6ac.svg', 'https://www.f1laps.com/static/icons/flags/BRA.a102e5631626.svg', 'https://www.f1laps.com/static/icons/flags/ARE.61f9f9f93387.svg', 'https://www.f1laps.com/static/icons/flags/PRT.70a47eede02a.svg', 'https://www.f1laps.com/static/icons/flags/CHN.7f8455b70734.svg']
    let endpoints = ['bahrain', 'saudi_arabia', 'australia', 'imola', 'miami', 'spain', 'monaco', 'azerbaijan', 'canada', 'silverstone', 'austria', 'france', 'hungary', 'spa', 'netherlands', 'monza', 'singapore', 'japan', 'usa', 'mexico', 'brazil', 'abudhabi']
    let data = {}
    let coll = client.db('data').collection('laptimes')
    let result = await coll.find({ userId: req.user.id }).toArray()
    let sum = 0
    result.forEach(e => {
        sum += parseInt(e.difficulty)
        data[e.track] = e
    })
    let avg = parseInt(sum / result.length)
    // console.log(data)
    ejs.renderFile('./protected/list.ejs', { pfp: req.user.photos ? req.user.photos[0]?.value : '', avg: avg, endpoints: endpoints, theme: req.user ? req.user.preferences.theme : defaultTheme, tracks: tracks, flags: flags, data: data }, {}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.end(template)
        }
    })
})

app.get('/calculator', async (req, res) => {
    let coll = client.db('data').collection('laptimes')
    let result = await coll.findOne({ userId: req.user.id, track: req.query.endpoint })

    ejs.renderFile('./protected/calculator.ejs', { ...req.query, difficulty: result ? result.difficulty : '', laptime: result ? result.laptime : '', theme: req.user ? req.user.preferences.theme : defaultTheme }, {}, (err, template) => {
        if (err) {
            throw err;
        } else {
            res.end(template)
        }
    })
})

app.get('/removedifficulty', (req, res) => {
    let coll = client.db('data').collection('laptimes').deleteOne({ userId: req.user.id, track: req.query.track })
    res.status(202).end()
})

app.get('/getdifficulty', (req, res) => {
    axios.get(`https://www.f1laps.com/ai-difficulty-calculator/f12022/${req.query.track}/?laptime=${req.query.laptime}#difficultyInputResult`)
        .then(res => {
            let dom = new jsdom.JSDOM(res.data).window.document
            let difficulty = dom.getElementsByClassName('text-indigo-700')[0].textContent
            return difficulty
        }).then(diff => {
            let data = { track: req.query.track, laptime: req.query.laptime, difficulty: diff }
            let coll = client.db('data').collection('laptimes').findOne({ userId: req.user.id, track: req.query.track }).then(resp => {
                if (resp) {
                    client.db('data').collection('laptimes').updateOne({ userId: req.user.id, track: req.query.track }, { $set: data })
                } else {
                    client.db('data').collection('laptimes').insertOne({ ...data, userId: req.user.id })
                }
            })
            res.json(data)
        })
})

module.exports = app