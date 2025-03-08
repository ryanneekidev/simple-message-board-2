const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db/pool');
const bcrypt = require('bcryptjs');

function initialize(passport){
    const authenticateUser = (email, password, done) => {
        const {rows} = pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        if(!user){
            return done(null, false, {message: 'Incorrect email'})
        }
        
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, {message: "Incorrect password"})
            }
        } catch(err) {
            return done(err)
        }  
    }

    passport.use(new LocalStrategy({usernameField: 'email'}), authenticateUser);
    passport.serializeUser((user, done) => {});
    passport.deserializeUser((id, done) => {})
}

module.exports = initialize;