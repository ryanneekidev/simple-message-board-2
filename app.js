const queries = require('./db/queries');

// App setup
const express = require('express');
const app = express();

// Import node utilities
const path = require('node:path');

// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// POST routes data body fix
app.use(express.urlencoded({extended: false}));

// Routes
app.get('/', async (req, res)=>{
    const users = await queries.getUsers();
    console.log(users);
    res.status(200).render('index', {})
});

app.get('/login', (req, res)=>{
    res.status(200).render('login', {})
})

app.get('/register', (req, res)=>{
    res.status(200).render('register', {})
})

app.post('/register', (req, res)=>{
    console.log(req.body)
})

// Start server
app.listen(3000, (req, res)=>{
    console.log('Server started at http://127.0.0.1:3000')
})