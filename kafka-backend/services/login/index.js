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
        response.status = 200;
        response.data = "NO_CUSTOMER";
        return callback(null, response);
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
            from: customer.cust_name,
            login_type: 0,
          };
          response.data = JSON.stringify(customerObject);
          return callback(null, response);
        } else {
          console.log("incorrect password");
          response.status = 401;
          response.data = "INCORRECT_PASSWORD";
          return callback(null, response);
        }
      }
    } else if (msg.path == "restaurant_login") {
      const restaurant = await Restaurant.findOne({
        email_id: msg.body.email_id,
      });
      if (!restaurant) {
        response.status = 200;
        response.data = "NO_CUSTOMER";
        return callback(null, response);
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
            from: restaurant.restaurant_name,
            login_type: 1,
          };
          response.data = JSON.stringify(restaurantObject);
          return callback(null, response);
        } else {
          response.status = 401;
          response.data = "INCORRECT_PASSWORD";
          return callback(null, response);
        }
      }
    } else {
      console.log("no path");
      callback(null, { status: 500, data: "no path found" });
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in encrypting password!!!";
    return callback(err, null);
  }
};

exports.handle_request = handle_request;
