"use strict";
const Restaurant = require("../../models/restaurant");
const Customer = require("../../models/customer");
const MenuItem = require("../../models/menu_item");
const MenuCategory = require("../../models/menu_category");
const Order = require("../../models/order");
const mongoose = require("mongoose");

let handle_request = async (msg, callback) => {
  console.log("Order service, path= ", msg.path);
  switch (msg.path) {
    case "place_order":
      placeOrder(msg, callback);
      break;
    case "all_orders_by_customer_id":
      getOrderByCustomerId(msg, callback);
      break;
    case "all_orders_by_restaurant_id":
      getOrderByRestaurantId(msg, callback);
      break;
    case "order_items_by_order_id":
      getOrderItems(msg, callback);
      break;
    case "update_order_status":
      updateOrderStatus(msg, callback);
      break;
    case "update_delivery_status":
      updateDeliveryStatus(msg, callback);
      break;
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

async function getOrderByCustomerId(msg, callback) {
  var err = {};
  let response = {};
  console.log("get order by customer id: ", msg);
  try {
    let customers = await Customer.findById(msg.body.customer_id);
    if (customers) {
      await customers.populate("order").execPopulate();
      await customers.order.populate("restaurant_id").execPopulate();
      response.status = 200;
      let data = [];
      for (let i = 0; i < customers.order; i++) {
        let schema = {
          order_id: customers.order[i]._id,
          restaurant_id: customers.order[i].restaurant_id._id,
          order_status: customers.order[i].order_status,
          order_data: customers.order[i].order_date,
          order_cost: customers.order[i].order_cost,
          order_delivery_status: customers.order[i].order_delivery_status,
          order_type: customers.order[i].order_type,
          restaurant_name: customers.order[i].restaurant_id.restaurant_name,
          zip_code: customers.order[i].restaurant_id.zip_code,
          customer_id: customers._id,
          cust_name: customers.cust_name,
          phone_number: customers.phone_number,
          city: customers.city,
        };
        data.push(schema);
      }
      response.data = JSON.stringify(data);
      return callback(null, response);
    } else {
      response.status = 500;
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

async function getOrderByRestaurantId(msg, callback) {
  var err = {};
  let response = {};
  console.log("get order by restaurant id: ", msg);
  try {
    let restaurants = await Restaurant.findById(msg.body.restaurant_id);
    if (restaurants) {
      await restaurants.populate("order").execPopulate();
      await restaurants.order.populate("customer_id").execPopulate();
      let data = [];
      for (let i = 0; i < restaurants.order; i++) {
        let schema = {
          order_id: restaurants.order[i]._id,
          restaurant_id: restaurants._id,
          order_status: restaurants.order[i].order_status,
          order_data: restaurants.order[i].order_date,
          order_cost: restaurants.order[i].order_cost,
          order_delivery_status: restaurants.order[i].order_delivery_status,
          order_type: restaurants.order[i].order_type,
          restaurant_name: restaurants.restaurant_name,
          restaurant_image: restaurants.restaurant_image,
          zip_code: restaurants.zip_code,
          customer_id: restaurants.order[i].customer_id._id,
          cust_name: restaurants.order[i].customer_id.cust_name,
          phone_number: restaurants.order[i].customer_id.phone_number,
          city: restaurants.order[i].customer_id.city,
        };
        data.push(schema);
      }
      response.status = 200;
      response.data = JSON.stringify(data);
      return callback(null, response);
    } else {
      response.status = 500;
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

async function getOrderItems(msg, callback) {
  var err = {};
  let response = {};
  console.log("get order items: ", msg);
  try {
    let order = await Order.findById(msg.body.order_id);
    if (order) {
      await order.order_item.populate("item_id").execPopulate();
      response.status = 200;
      response.data = JSON.stringify(order);
      return callback(null, response);
    } else {
      response.status = 500;
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

async function updateOrderStatus(msg, callback) {
  var err = {};
  let response = {};
  console.log("update order status: ", msg);
  try {
    let order = await Order.findById(msg.body.order_id);
    if (order) {
      order.order_status = msg.body.order_status;
      let updated = await order.save();
      if (updated) {
        response.status = 200;
        response.data = "UPDATED";
        return callback(null, response);
      } else {
        response.status = 500;
        response.data = "NO_RECORD";
        return callback(null, response);
      }
    } else {
      response.status = 500;
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

async function updateDeliveryStatus(msg, callback) {
  var err = {};
  let response = {};
  console.log("Update delivery status: ", msg);
  try {
    let order = await Order.findById(msg.body.order_id);
    if (order) {
      order.order_delivery_status = msg.body.order_delivery_status;
      let updated = await order.save();
      if (updated) {
        response.status = 200;
        response.data = "UPDATED";
        return callback(null, response);
      } else {
        response.status = 500;
        response.data = "NO_RECORD";
        return callback(null, response);
      }
    } else {
      response.status = 500;
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

async function placeOrder(msg, callback) {
  let err = {};
  let response = {};
  console.log("Place order: ", msg);
  try {
    /// \todo validate res_id and item id
    let res = await Restaurant.findById(msg.body.restaurant_id);
    let cust = await Customer.findById(msg.body.customer_id);
    if (!cust || !res) {
      response.status = 500;
      response.data = "ORDER_ERROR";
      return callback(null, response);
    } else {
      // let sql = `CALL add_order('${req.body.customer_id}', '${req.body.restaurant_id}',
      // '${req.body.order_status}','${req.body.order_cost}', '${req.body.order_type}', '${req.body.order_delivery_status}');`;
      let newOrder = new Order({
        order_type: msg.body.order_type,
        order_status: msg.body.order_status,
        order_cost: msg.body.order_cost,
        order_delivery_status: msg.body.order_delivery_status,
        customer_id: cust._id,
        restaurant_id: res._id,
      });
      msg.body.cart_items.forEach(async (cart_item) => {
        let item = await MenuItem.findById(cart_item.item_id);
        if (!item) {
          response.status = 500;
          response.data = "Data error";
          return callback(null, response);
        } else {
          newOrder.order_item.item_id.push(item._id);
          newOrder.order_item.item_quantity.push(cart_item.item_quantity);
        }
      });
      let savedOrder = await newOrder.save();
      if (!savedOrder) {
        response.status = 500;
        response.data = "Data error";
        return callback(null, response);
      } else {
        res.order.push(savedOrder._id);
        cust.order.push(savedOrder._id);
        let savedRes = await res.save();
        let savedCust = await cust.save();
        if (savedRes && savedCust) {
          response.status = 200;
          response.data = { status: "ORDER_PLACED" };
          return callback(null, response);
        } else {
          response.status = 500;
          response.data = "data error";
          return callback(null, response);
        }
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
