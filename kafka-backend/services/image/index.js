"use strict";
const Restaurant = require("../../models/restaurant");
const Customer = require("../../models/customer");
const MenuItem = require("../../models/menu_item");

let handle_request = async (msg, callback) => {
  console.log("Image service, path= ", msg.path);
  switch (msg.path) {
    case "upload_customer_image":
      uploadCustomerImage(msg, callback);
      break;
    case "upload_restaurant_image":
      uploadRestaurantImage(msg, callback);
      break;
    case "upload_item_image":
      uploadItemImage(msg, callback);
      break;
    case "upload_event_image":
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

async function uploadCustomerImage(msg, callback) {
  let err = {};
  let response = {};
  console.log("Upload customer image: ", msg);
  try {
    let customer = await Customer.findById(msg.body.customer_id);
    if (customer) {
      customer.cust_image = msg.filename;
      let customerSave = await customer.save();
      if (customerSave) {
        response.status = 200;
        response.data = msg.filename;
        return callback(null, response);
      } else {
        err.status = 401;
        err.data = "NO_RECORD";
        return callback(err, null);
      }
    } else {
      err.status = 401;
      err.data = "NO_RECORD";
      return callback(err, null);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}

async function uploadRestaurantImage(msg, callback) {
  let err = {};
  let response = {};
  console.log("Upload restaurant image: ", msg);
  try {
    let restaurant = await Restaurant.findById(msg.body.restaurant_id);
    if (restaurant) {
      restaurant.restaurant_image = msg.filename;
      let restaurantSave = await restaurant.save();
      if (restaurantSave) {
        response.status = 200;
        response.data = msg.filename;
        return callback(null, response);
      } else {
        err.status = 401;
        err.data = "NO_RECORD";
        return callback(err, null);
      }
    } else {
      err.status = 401;
      err.data = "NO_RECORD";
      return callback(err, null);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}

async function uploadItemImage(msg, callback) {
  let err = {};
  let response = {};
  console.log("Upload item image: ", msg);
  try {
    let item = await MenuItem.findById(msg.body.item_id);
    if (item) {
      item.item_image = msg.filename;
      let itemSave = await item.save();
      if (itemSave) {
        response.status = 200;
        response.data = msg.filename;
        return callback(null, response);
      } else {
        err.status = 401;
        err.data = "NO_RECORD";
        return callback(err, null);
      }
    } else {
      err.status = 401;
      err.data = "NO_RECORD";
      return callback(err, null);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}

exports.handle_request = handle_request;
