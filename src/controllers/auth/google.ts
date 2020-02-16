import express from 'express';

import passport from './../../authentication/passport';

const google = express.Router();

google.get('/', passport.authenticate('google', { scope: ['profile'] }));

google.get('/callback', 
  passport.authenticate(
    'google',
    { failureRedirect: '/login' }),
    function(req, res) {
      if (req.session) {
        req.session.save(() => res.redirect('/'));
      }
    }
);

export default google;
