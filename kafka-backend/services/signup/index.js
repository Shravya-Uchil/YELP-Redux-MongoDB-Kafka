"use strict";
const Customer = require("../../models/customer");
const Restaurant = require("../../models/restaurant");
const bcrypt = require("bcrypt");

let handle_request = async (msg, callback) => {
  let response = {};
  let err = {};
  var encryptedPassword;
  if (msg.path == "customer_signup") {
    try {
      const customer = await Customer.findOne({
        email_id: msg.body.email_id,
      });
      if (customer) {
        err.status = 401;
        err.data = "CUSTOMER_EXISTS";
        return callback(err, null);
      } else {
        encryptedPassword = await bcrypt.hash(msg.body.password, 12);
        let customer = new Customer({
          cust_name: msg.body.cust_name,
          email_id: msg.body.email_id,
          password: encryptedPassword,
        });
        const customersave = await customer.save();
        if (customersave) {
          response.status = 200;
          response.data = "CUSTOMER_ADDED";
          return callback(null, response);
        } else {
          err.status = 500;
          err.data = "Error in Data";
          return callback(err, null);
        }
      }
    } catch (error) {
      console.log(error);
      err.status = 500;
      err.data = "Error in encrypting password!!!";
      return callback(err, null);
    }
  } else if (msg.path == "restaurant_signup") {
    try {
      const restaurant = await Restaurant.findOne({
        email_id: msg.body.email_id,
      });
      if (restaurant) {
        err.status = 401;
        err.data = "RESTAURANT_EXISTS";
        return callback(err, null);
      } else {
        encryptedPassword = await bcrypt.hash(msg.body.password, 12);
        let restaurant = new Restaurant({
          restaurant_name: msg.body.restaurant_name,
          email_id: msg.body.email_id,
          password: encryptedPassword,
          zip_code: msg.body.zip_code,
          lat: msg.body.lat,
          lan: msg.body.lan,
        });
        const restaurantsave = await restaurant.save();
        if (restaurantsave) {
          response.status = 200;
          response.data = "RESTAURANT_ADDED";
          return callback(null, response);
        } else {
          err.status = 500;
          err.data = "Error in Data";
          return callback(err, null);
        }
      }
    } catch (error) {
      console.log(error);
      err.status = 500;
      err.data = "Error in encrypting password!!!";
      return callback(err, null);
    }
  } else {
    callback(null, { status: 500, response: "no path found" });
  }
};

exports.handle_request = handle_request;
