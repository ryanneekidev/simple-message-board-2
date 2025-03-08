// App setup
const express = require('express');
const app = express();

// Import utilities
const path = require('node:path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const LocalStrategy = require('passport-local').Strategy;

// Queries library
const queries = require('./db/queries');

// Direct pool access
const pool = require('./db/pool');

// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// POST routes data body fix
app.use(express.urlencoded({extended: false}));

// Flash messages
app.use(flash());

// Express session
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));

// Method overriding
app.use(methodOverride('_method'));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async function verify(email, password, done){
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            const user = rows[0];
    
            if (!user) {
                return done(null, false, { message: "Incorrect email" });
            }

            if (!(await bcrypt.compare(password, user.password))) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);  

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];
  
        done(null, user);
    } catch(err) {
        done(err);
    }
});

// Make user object globally available
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});  

// Routes
app.get('/', checkAuth, async (req, res)=>{
    const messages = await queries.getMessagesAndAuthors();
    res.status(200).render('index', {messages: messages})
});

app.get('/login', checkNoAuth, (req, res)=>{
    res.status(200).render('login', {})
})

app.get('/register',checkNoAuth, (req, res)=>{
    res.status(200).render('register', {})
})

app.get('/new-message', checkAuth, (req, res)=>{
    res.status(200).render('new-message', {})
})

app.get('/secret-club', checkAuth, (req, res)=>{
    res.status(200).render('secret-club', {})
})

app.post('/register', async (req, res, next)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        await queries.createUser(email, hashedPassword);
        res.redirect('/login')
    } catch(error) {
        return next(error)
    }
})

app.post('/login', checkNoAuth, passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/new-message', async (req, res)=>{
    const newMessage = {
        content: req.body.message,
        poster_id: req.user.id,
        date: new Date(),
    }
    await queries.postMessage(newMessage.content, newMessage.poster_id, newMessage.date);
    res.redirect('/')
});

app.post('/henki', async (req, res)=>{
    const code = req.body.code;
    if(code===process.env.SECRETS){
        queries.promoteUser(req.user.id);
        res.redirect('/')
    }else{
        res.redirect('/')
    }
});

app.delete('/logout', function(req, res, next) {
    req.logout(function(err){
        if(err){
            return next(err);
        }
        res.redirect('/');
    });
});

function checkAuth(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkNoAuth(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

// Start server
app.listen(3000, (req, res)=>{
    console.log('Server started at http://127.0.0.1:3000')
})