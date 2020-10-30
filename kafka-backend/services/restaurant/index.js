"use strict";
const Restaurant = require("../../models/restaurant");
const MenuItem = require("../../models/menu_item");
const MenuCategory = require("../../models/menu_category");

let handle_request = async (msg, callback) => {
  console.log("Restaurant service, path= ", msg.path);
  switch (msg.path) {
    case "search":
      break;
    case "restaurant":
      getRestaurantById(msg, callback);
      break;
    case "update_restaurant":
      break;
    case "restaurant_review":
      break;
    case "add_restaurant_review":
      break;
    case "hasReviewed":
      break;
    default:
      callback(null, { status: 500, response: "no path found" });
  }
};

async function getRestaurantById(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get restaurant by id: ", msg);
  try {
    let restaurant = await Restaurant.findById(msg.body.restaurant_id);
    if (restaurant) {
      response.statue = 200;
      response.data = JSON.stringify(restaurant);
      return callback(null, response);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}

/*let handle_request = async (msg, callback) => {
  let response = {};
  let err = {};
  var encryptedPassword;
  if (msg.path == "customer_login") {
    try {
      const customer = await User.findOne({
        email_id: msg.body.email_id,
      });
      if (!customer) {
        err.status = 401;
        err.data = "NO_CUSTOMER";
        return callback(err, null);
      } else {
        let isValidPassword = await bcrypt.compare(
          msg.body.password,
          customer.password
        );
        if (isValidPassword) {
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
          err.status = 401;
          err.data = "INCORRECT_PASSWORD";
          return callback(err, null);
        }
      }
    } catch (error) {
      console.log(error);
      err.status = 500;
      err.data = "Error in encrypting password!!!";
      return callback(err, null);
    }
  } else if (msg.path == "restaurant_login") {
    try {
      const restaurant = await User.findOne({
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
    } catch (error) {
      console.log(error);
      err.status = 500;
      err.data = "Error in encrypting password!!!";
      return callback(err, null);
    }
  } else {
    callback(null, { status: 500, response: "no path found" });
  }
};*/

exports.handle_request = handle_request;
