const router = require('express').Router();
const passport = require('passport');

// // auth login
// router.get('/login', (req, res) => {
//     res.render('login', { user: req.user });
// });

// // auth logout
// router.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/');
// });


router.get('/azureadoauth2', passport.authenticate('azure_ad_oauth2', {
    scope: ['wl.signin']
}));

router.get('/azureadoauth2/callback', passport.authenticate('azure_ad_oauth2'), (req, res) => {
   
    res.redirect('/hab/admin');
});

module.exports = router;
