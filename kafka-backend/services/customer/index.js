"use strict";
const Restaurant = require("../../models/restaurant");
const Customer = require("../../models/customer");
const MenuItem = require("../../models/menu_item");
const MenuCategory = require("../../models/menu_category");
const Review = require("../../models/review");

let handle_request = async (msg, callback) => {
  console.log("Customer service, path= ", msg.path);
  switch (msg.path) {
    case "customer_email":
      getCustomerByEmail(msg, callback);
      break;
    case "customer_id":
      getCustomerById(msg, callback);
      break;
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

function renameKey(obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

async function getCustomerById(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get customer by id: ", msg);
  try {
    let customer = await Customer.findById(msg.body.cust_id);
    if (customer) {
      response.status = 200;
      renameKey(customer, "_id", "cust_id");
      response.data = JSON.stringify(customer);
      return callback(null, response);
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

async function getCustomerByEmail(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get customer by id: ", msg);
  try {
    let customer = await Customer.findOne({
      email_id: msg.body.email_id,
    });
    if (customer) {
      response.status = 200;
      renameKey(customer, "_id", "cust_id");
      response.data = JSON.stringify(customer);
      return callback(null, response);
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
