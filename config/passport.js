const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy (
    function(email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Email no existente o incorrecto.' });
            if (!user.validPassword(password)) return done(null, false, { message: 'Password incorrecto' });

            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    User.findById(id, function(err, user) {
        cb(err, user);
    });
});

module.exports = passport;