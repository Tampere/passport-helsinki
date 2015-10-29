/**
 * Module dependencies.
 */
var util = require('util'),
    OAuth2Strategy = require('passport-oauth2'),
    Profile = require('./profile'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError;


function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://api.hel.fi/sso/oauth2/authorize/';
  options.tokenURL = options.tokenURL || 'https://api.hel.fi/sso/oauth2/token/';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-helsinki';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'helsinki';
  this._userProfileURL = options.userProfileURL || 'https://api.hel.fi/sso/user/';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from City of Helsinki SSO API.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `helsinki`
 *   - `id`             the user's UUID
 *   - `username`         the user's username
 *   - `displayName`      the user's full name
 *   - `emails`           the user's email addresses
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;
    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }
    
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }
    
    var profile = Profile.parse(json);
    profile.provider  = 'helsinki';
    profile._raw = body;
    profile._json = json;
    
    done(null, profile);
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
