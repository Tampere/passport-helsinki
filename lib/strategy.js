/**
 * Module dependencies.
 */
var util = require('util'),
    OAuth2Strategy = require('passport-oauth2'),
    Profile = require('./profile'),
    InternalOAuthError = require('passport-oauth2').InternalOAuthError;


function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://auth.tampere.fi/oauth2/authorize/';
  options.tokenURL = options.tokenURL || 'https://auth.tampere.fi/oauth2/token/';
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-tampere';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'tampere';
  this._userProfileURL = options.userProfileURL || 'https://auth.tampere.fi/user/';
  this._appTokenURL = options.appTokenURL || 'https://auth.tampere.fi/jwt-token/'
  this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from City of Tampere SSO API.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `tampere`
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
    profile.provider  = 'tampere';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
}

Strategy.prototype.getAPIToken = function(accessToken, targetApp, done) {
  url = this._appTokenURL;
  if (targetApp != undefined) {
    url += '?target_app=' + targetApp;
  }

  this._oauth2.get(url, accessToken, function (err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch app token for app ' + targetApp, err));
    }
    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse app token'));
    }
    done(json.token);
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
