require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Users = require('../models/user');

passport.use(Users.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, username: user.username,role:user.role });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URI,
    scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, cb) => {
    console.log(profile)
    try {
        
        let user = await Users.findOne({ googleId: profile.id });
        
        if (!user) {
            
            user = new Users({
                googleId: profile.id,
                username: profile.displayName || profile.emails[0].value, 
                role: 'viewer' 
            });
            await user.save();
        }

        return cb(null, user);
    } catch (err) {
        console.error("Error during Google login:", err);
        return cb(err, null);
    }
}));

module.exports = passport;
