"use strict";
const Customer = require("../../models/customer");
const Restaurant = require("../../models/restaurant");
const bcrypt = require("bcrypt");

let handle_request = async (msg, callback) => {
  let response = {};
  let err = {};
  var encryptedPassword;
  try {
    if (msg.path == "customer_login") {
      const customer = await Customer.findOne({
        email_id: msg.body.email_id,
      });
      if (!customer) {
        console.log("no customer found");
        err.status = 401;
        err.data = "NO_CUSTOMER";
        return callback(err, null);
      } else {
        let isValidPassword = await bcrypt.compare(
          msg.body.password,
          customer.password
        );
        if (isValidPassword) {
          console.log("customer found");
          response.status = 200;
          let customerObject = {
            customer_id: customer._id,
            cust_name: customer.cust_name,
            email_id: customer.email_id,
            password: customer.password,
          };
          response.data = JSON.stringify(customerObject);
          return callback(null, response);
        } else {
          console.log("incorrect password");
          err.status = 401;
          err.data = "INCORRECT_PASSWORD";
          return callback(err, null);
        }
      }
    } else if (msg.path == "restaurant_login") {
      const restaurant = await Restaurant.findOne({
        email_id: msg.body.email_id,
      });
      if (!restaurant) {
        err.status = 401;
        err.data = "NO_CUSTOMER";
        return callback(err, null);
      } else {
        let isValidPassword = await bcrypt.compare(
          msg.body.password,
          restaurant.password
        );
        if (isValidPassword) {
          response.status = 200;
          let restaurantObject = {
            customer_id: restaurant._id,
            cust_name: restaurant.cust_name,
            email_id: restaurant.email_id,
            password: restaurant.password,
          };
          response.data = JSON.stringify(restaurantObject);
          return callback(null, response);
        } else {
          err.status = 401;
          err.data = "INCORRECT_PASSWORD";
          return callback(err, null);
        }
      }
    } else {
      console.log("no path");
      callback(null, { status: 500, response: "no path found" });
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in encrypting password!!!";
    return callback(err, null);
  }
};

exports.handle_request = handle_request;
