"use strict";
const Restaurant = require("../../models/restaurant");
const Customer = require("../../models/customer");
const Event = require("../../models/event");

let handle_request = async (msg, callback) => {
  console.log("Event service, path= ", msg.path);
  switch (msg.path) {
    case "all_events":
      getAllEvents(msg, callback);
      break;
    case "event_name":
      getEventByName(msg, callback);
      break;
    case "event_by_restaurant_id":
      getEventByRestaurantId(msg, callback);
      break;
    case "create_event":
      createEvent(msg, callback);
      break;
    case "register_event_by_customer_id":
      registerForEvent(msg, callback);
      break;
    case "get_registered_events_by_customer_id":
      getRegisteredEventForCustomer(msg, callback);
      break;
    case "is_registered":
      isCustomerRegistered(msg, callback);
      break;
    case "get_registered_customers_by_event_id":
      getCustomersRegisteredToEvent(msg, callback);
      break;
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

function renameKey(obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

async function getAllEvents(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get all events: ", msg);
  try {
    let events = await Event.find();
    if (events) {
      response.status = 200;
      events.forEach((obj) => renameKey(obj, "_id", "event_id"));
      response.data = JSON.stringify(events);
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

async function getEventByName(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get event by name: ", msg);
  try {
    let events = await Event.find({
      event_name: new RegExp(msg.body.event_name, "gi"),
    });
    if (events) {
      response.status = 200;
      events.forEach((obj) => renameKey(obj, "_id", "event_id"));
      response.data = JSON.stringify(events);
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

async function getEventByRestaurantId(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get event by restaurant id: ", msg);
  try {
    let restaurant = await Restaurant.findById(msg.body.res_id, {
      event: 1,
    });
    await restaurant
      .populate({
        path: "event",
      })
      .execPopulate();
    if (restaurant && restaurant.event.length > 0) {
      let events = restaurant.event;
      response.status = 200;
      events.forEach((obj) => renameKey(obj, "_id", "event_id"));
      response.data = JSON.stringify(events);
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

async function createEvent(msg, callback) {
  let err = {};
  let response = {};
  console.log("Create event: ", msg);
  let time = req.body.event_time;
  time = time + ":00";
  try {
    let event = await Event.find({
      $and: [
        { event_name: msg.body.event_name },
        { event_description: msg.body.event_description },
        { event_time: msg.body.time },
        { event_date: msg.body.event_date },
        { event_location: msg.body.event_location },
        { event_hashtag: msg.body.event_hashtag },
        { restaurant_id: msg.body.restaurant_id },
      ],
    });
    if (event) {
      response.status = 500;
      response.data = "EVENT_EXISTS";
      return callback(null, response);
    } else {
      let restaurant = Restaurant.findById(msg.body.restaurant_id);
      if (!restaurant) {
        let newEvent = new Event({
          event_name: msg.body.event_name,
          event_description: msg.body.event_description,
          event_time: msg.body.time,
          event_date: msg.body.event_date,
          event_location: msg.body.event_location,
          event_hashtag: msg.body.event_hashtag,
          restaurant_id: msg.body.restaurant_id,
        });
        let savedEvt = await newEvent.save();
        if (savedEvt) {
          restaurant.event.push(savedEvt._id);
          var saved = await restaurant.save();
          if (saved) {
            response.status = 200;
            let data = JSON.stringify({
              event_id: newEvent._id,
              status: "EVENT_ADDED",
            });
            response.data = data;
            return callback(null, response);
          }
        }
        if (!savedEvt || !saved) {
          response.status = 500;
          response.data = JSON.stringify({ status: "FAILED" });
          return callback(null, response);
        }
      } else {
        response.status = 500;
        response.data = JSON.stringify({ status: "FAILED" });
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

async function registerForEvent(msg, callback) {
  let err = {};
  let response = {};
  console.log("Create event: ", msg);
  //let sql = `CALL register_to_event('${req.body.event_id}', '${req.body.restaurant_id}', '${req.body.customer_id}');`;
  try {
    let customer = await Customer.findById(msg.customer_id);
    let event = await Event.find({ restaurant_id: msg.restaurant_id });
    //let restaurant = await Customer.findById(msg.restaurant_id);

    if (!customer || !event || event._id.toString() != msg.event_id) {
      response.status = 500;
      response.data = JSON.stringify({ status: "Error in Data" });
      return callback(null, response);
    } else {
      if (customer.event.indexOf(event._id) != -1) {
        customer.event.push(event._id);
        let savedCust = await customer.save();
        if (event.customer_id.indexOf(savedCust._id) != -1) {
          event.customer_id.push(savedCust._id);
          let savedEvt = await event.save();
        }
        response.status = 200;
        response.data = "REGISTERED";
        return callback(null, response);
      } else {
        response.status = 500;
        response.data = "REGISTRATION_EXISTS";
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

async function getRegisteredEventForCustomer(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get registered event for customer: ", msg);
  try {
    let restaurant = await Restaurant.findById(msg.body.res_id, {
      event: 1,
    });
    await restaurant
      .populate({
        path: "event",
      })
      .execPopulate();
    if (restaurant && restaurant.event.length > 0) {
      let events = restaurant.event;
      response.status = 200;
      events.forEach((obj) => renameKey(obj, "_id", "event_id"));
      response.data = JSON.stringify(events);
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

async function isCustomerRegistered(msg, callback) {
  let err = {};
  let response = {};
  console.log("Is customer registered: ", msg);
  try {
    let found = false;
    let customer = await Customer.findById(msg.body.customer_id);
    if (customer) {
      let events = customer.event;
      for (e in events) {
        if (e._id.toString === msg.body.event_id) {
          found = true;
          break;
        }
      }
    }
    if (found) {
      response.status = 200;
      response.data = JSON.stringify({ result: "REGISTERED" });
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

async function getCustomersRegisteredToEvent(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get registered customers for event: ", msg);
  try {
    let event = await Event.findById(msg.body.event_id);
    if (event && event.customer.length > 0) {
      let customers = event.customer;
      response.status = 200;
      customers.forEach((obj) => renameKey(obj, "_id", "customer_id"));
      response.data = JSON.stringify(customers);
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

exports.handle_request = handle_request;
