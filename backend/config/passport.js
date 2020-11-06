"use strict";
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
var { secret } = require("./config");
const kafka = require("../kafka/client");

// Setup work and export for the JWT passport strategy
function auth() {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = secret;
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, callback) {
      const customer_id = jwt_payload.customer_id;
      const login_type = jwt_payload.login_type;
      if (login_type === 0) {
        let data = {};
        kafka.make_request(
          "customer-topic",
          { path: "customer_id", body: { cust_id: customer_id } },
          function (err, results) {
            if (err) {
              console.log(err);
              return callback(err.data, false);
            } else {
              console.log("********* passport auth!!! ******");
              return callback(null, results.data);
            }
          }
        );
      } else {
        kafka.make_request(
          "restaurant-topic",
          { path: "restaurant", body: { restaurant_id: customer_id } },
          function (err, results) {
            if (err) {
              console.log(err);
              return callback(err.data, false);
            } else {
              console.log("********* passport auth!!! ******");
              return callback(null, results.data);
            }
          }
        );
      }
    })
  );
}
const checkAuth = passport.authenticate("jwt", { session: false });

exports.auth = auth;
exports.checkAuth = checkAuth;
