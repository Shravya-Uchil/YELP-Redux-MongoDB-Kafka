"use strict";
const Restaurant = require("../../models/restaurant");
const Customer = require("../../models/customer");
const Message = require("../../models/message");

let handle_request = async (msg, callback) => {
  console.log("Message service, path= ", msg.path);
  switch (msg.path) {
    case "all_messages_customer":
      getAllMessagesCustomer(msg, callback);
      break;
    case "all_messages_restaurant":
      getAllMessagesRestaurant(msg, callback);
      break;
    case "message_details":
      getMessageDetails(msg, callback);
      break;
    case "send_message":
      sendMessage(msg, callback);
      break;
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

async function getAllMessagesCustomer(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get all messages for customer: ", msg);
  try {
    let messages = await Message.find({ customer_id: msg.body.customer_id });
    if (messages) {
      let i = 0;
      let body = [];
      console.log("messages");
      console.log(messages);
      for (i = 0; i < messages.length; i++) {
        let cust = await Customer.findById(messages[i].customer_id);
        let restaurant = await Restaurant.findById(messages[i].restaurant_id);
        if (!cust || !restaurant) {
          response.status = 500;
          response.data = "Data error";
          return callback(null, response);
        }
        let data = {
          customer_id: cust._id,
          restaurant_id: restaurant._id,
          customer_name: cust.cust_name,
          restaurant_name: restaurant.restaurant_name,
          start_date: messages[i].start_date,
        };
        console.log("data");
        console.log(data);
        body.push(data);
      }
      console.log("body");
      console.log(body);
      response.status = 200;
      //events.forEach((obj) => renameKey(obj, "_id", "event_id"));
      response.data = JSON.stringify(body);
      return callback(null, response);
    } else {
      response.status = 401;
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

async function getAllMessagesRestaurant(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get all messages for restaurant: ", msg);
  try {
    let messages = await Message.find({
      restaurant_id: msg.body.restaurant_id,
    });
    if (messages) {
      let i = 0;
      let body = [];
      for (i = 0; i < messages.length; i++) {
        let cust = await Customer.findById(messages[i].customer_id);
        let restaurant = await Restaurant.findById(messages[i].restaurant_id);
        if (!cust || !restaurant) {
          response.status = 500;
          response.data = "Data error";
          return callback(null, response);
        }
        let data = {
          customer_id: cust._id,
          restaurant_id: restaurant._id,
          customer_name: cust.cust_name,
          restaurant_name: restaurant.restaurant_name,
          start_date: messages[i].start_date,
        };
        body.push(data);
      }
      response.status = 200;
      //events.forEach((obj) => renameKey(obj, "_id", "event_id"));
      response.data = JSON.stringify(body);
      return callback(null, response);
    } else {
      response.status = 401;
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

async function getMessageDetails(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get message details: ", msg);
  try {
    let message = await Message.findOne({
      $and: [
        { restaurant_id: msg.body.restaurant_id },
        { customer_id: msg.body.customer_id },
      ],
    });
    console.log("found msg");
    console.log(message);
    console.log(await Message.find());
    if (message) {
      response.status = 200;
      //events.forEach((obj) => renameKey(obj, "_id", "event_id"));
      response.data = JSON.stringify(message.message_array);
      return callback(null, response);
    } else {
      response.status = 401;
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

async function sendMessage(msg, callback) {
  let err = {};
  let response = {};
  console.log("Send message: ", msg);
  try {
    let message = await Message.findOne({
      $and: [
        { restaurant_id: msg.body.restaurant_id },
        { customer_id: msg.body.customer_id },
      ],
    });
    let data = {
      message_text: msg.body.message_text,
      message_date: new Date(Date.now()),
      from: msg.body.from,
    };
    if (message) {
      message.message_array.push(data);
      let savedMsg = await message.save();
      if (savedMsg) {
        response.status = 200;
        response.data = "MESSAGE_SENT";
        return callback(null, response);
      } else {
        response.status = 500;
        response.data = "Data error";
        return callback(null, response);
      }
    } else {
      let message = new Message({
        customer_id: msg.body.customer_id,
        restaurant_id: msg.body.restaurant_id,
        start_date: data.message_date,
        message_array: [],
      });
      message.message_array.push(data);

      let newMsg = await message.save();
      if (newMsg) {
        response.status = 200;
        response.data = "MESSAGE_SENT";
        return callback(null, response);
      } else {
        response.status = 500;
        response.data = "Data error";
        return callback(null, response);
      }
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}
exports.handle_request = handle_request;
