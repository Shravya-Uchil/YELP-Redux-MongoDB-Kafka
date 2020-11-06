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
    case "all_customers":
      getAllCustomers(msg, callback);
      break;
    case "follow_user":
      followUser(msg, callback);
      break;
    case "search_user":
      searchCustomer(msg, callback);
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

async function getAllCustomers(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get all users: ", msg);
  try {
    let users = await Customer.find();
    if (users) {
      response.status = 200;
      //events.forEach((obj) => renameKey(obj, "_id", "event_id"));
      response.data = JSON.stringify(users);
      return callback(null, response);
    } else {
      response.status = 200;
      response.data = JSON.stringify({ result: "NO_RECORD" });
      return callback(null, response);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}

async function followUser(msg, callback) {
  let response = {};
  let err = {};
  let userUpdated;
  let targetUserUpdated;
  console.log("Follow users: ", msg);
  try {
    let current_user = await Customer.findById(msg.body.current_cust_id);
    let target_user = await Customer.findById(msg.body.target_cust_id);

    console.log(current_user);
    console.log(target_user);
    if (!current_user || !target_user) {
      response.status = 401;
      response.data = JSON.stringify({ result: "NO_RECORD" });
      return callback(null, response);
    } else {
      let index = current_user.following.indexOf(target_user._id);
      if (index === -1) {
        current_user.following.push(target_user._id);
        userUpdated = await current_user.save();
      }

      index = target_user.followers.indexOf(current_user._id);
      if (index === -1) {
        target_user.followers.push(current_user._id);
        targetUserUpdated = await target_user.save();
      }

      if (userUpdated && targetUserUpdated) {
        response.status = 200;
        response.data = JSON.stringify({ result: "CUSTOMER_FOLLOWED" });
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
    err.data = "INTERNAL_SERVER_ERROR";
    return callback(err, null);
  }
}

async function searchCustomer(msg, callback) {
  let err = {};
  let response = {};
  console.log("Search for a users: ", msg);
  try {
    let users = await Customer.find({
      $or: [
        { cust_name: new RegExp(msg.body.search_str, "gi") },
        { nick_name: new RegExp(msg.body.search_str, "gi") },
      ],
    });
    if (users) {
      response.status = 200;
      //events.forEach((obj) => renameKey(obj, "_id", "event_id"));
      response.data = JSON.stringify(users);
      return callback(null, response);
    } else {
      response.status = 200;
      response.data = "NO_RECORD";
      return callback(null, response);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}

exports.handle_request = handle_request;
