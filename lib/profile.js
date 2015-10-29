/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  var profile = {};
  profile.id = String(json.uuid);
  profile.displayName = json.display_name;
  profile.firstName = json.first_name;
  profile.lastName = json.last_name;
  profile.department = json.department;
  profile.username = json.username;
  if (json.email) {
    profile.emails = [{ value: json.email }];
  }
  
  return profile;
};
