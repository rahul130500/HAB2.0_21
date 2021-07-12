/*const LocalStrategy = require("passport-local").Strategy;

// Load User model
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
};
*/

const passport = require('passport');
const AzureStrategy = require('passport-azure-ad-oauth2').Strategy;

const User = require('../models/user');
const { isLoggedIn, isAdmin } = require("../middleware/adminauth");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { OUTLOOK_CLIENT_ID, OUTLOOK_CLIENT_SECRET} = process.env;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
  new AzureStrategy(
    {
      clientID: OUTLOOK_CLIENT_ID,
      clientSecret: OUTLOOK_CLIENT_SECRET,
      callbackURL: `/auth/azureadoauth2/callback`,
      
    },
    async (accessToken, refresh_token, params, profile, done) => {
      try {
        var waadProfile = jwt.decode(params.id_token);
        //console.log(waadProfile);

        const user = await User.findOne({ email: waadProfile.upn });
        if (user) return done(null, user);

        const newUser = new User({
          outlookId: waadProfile.oid,
          username: waadProfile.name,
          email: waadProfile.upn,
          
          // isverified: true,
        });
        if (refresh_token) newUser.refreshToken = refresh_token;

        const users = await User.find({});
        if (users.length == 0) {
          newUser.isAdmin = true;
        }
        

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.log(error.message);
      }
    }
  )
);