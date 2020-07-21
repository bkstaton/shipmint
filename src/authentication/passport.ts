import passport from 'passport';
import google from 'passport-google-oauth20';
import { User } from '../models';

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

passport.use(new google.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${process.env.GOOGLE_AUTH_CALLBACK}/auth/google/callback`,
  },
  (_accessToken, _refreshToken, profile, done) => {
    if (!profile.emails) {
      return done('Only goshipmint.com or codercouple.com emails are allowed');
    }

    const email = profile.emails.find(email => /(codercouple.com$|goshipmint.com$)/.test(email.value));
    if (!email) {
      return done('Only goshipmint.com or codercouple.com emails are allowed');
    }

    User.findOrCreate({
      where: {
        googleId: profile.id,
      },
    }).then(([user, created]: [User, boolean]) => {
      if (created) {
        user.update({
          name: profile.displayName,
          email: email.value,
        }).then((user: User) => {
          return done(undefined, user);
        });
      } else {
        return done(undefined, user);
      }
    });
  }
));

export default passport;