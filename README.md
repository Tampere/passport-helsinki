# Passport-Tampere

[Passport](http://passportjs.org/) strategy for authenticating with City of Tampere SSO
using the OAuth 2.0 API.

This module lets you authenticate using the City of Tampere SSO API in your Node.js
applications. By plugging into Passport, City of Tampere authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install git+https://github.com/Tampere/passport-tampere.git

## Usage

#### Configure Strategy

The Tampere authentication strategy authenticates users using OAuth 2.0 tokens.
The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

    passport.use(new TampereStrategy({
        clientID: OAUTH2_CLIENT_ID,
        clientSecret: OAUTH2_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ id: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'tampere'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/tampere',
      passport.authenticate('tampere'));

    app.get('/auth/tampere/callback',
      passport.authenticate('tampere', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

## Credits

  - [Juha Yrjölä](http://github.com/juyrjola)
  - [Jared Hanson](http://github.com/jaredhanson) (boilerplate code)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 City of Helsinki <[http://www.hel.fi/](http://www.hel.fi/)>
