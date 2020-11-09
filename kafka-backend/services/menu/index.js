"use strict";
const Restaurant = require("../../models/restaurant");
const Customer = require("../../models/customer");
const MenuItem = require("../../models/menu_item");
const MenuCategory = require("../../models/menu_category");
const mongoose = require("mongoose");

let handle_request = async (msg, callback) => {
  console.log("Menu service, path= ", msg.path);
  switch (msg.path) {
    case "category_by_restaurant_id":
      getCategoryByRestaurantId(msg, callback);
      break;
    case "category_by_category_id":
      getCategoryByCategoryId(msg, callback);
      break;
    case "item_by_restaurant_id":
      getItemByRestaurantId(msg, callback);
      break;
    case "add_item":
      addItem(msg, callback);
      break;
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

function renameKey(obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

async function getCategoryByRestaurantId(msg, callback) {
  var err = {};
  let response = {};
  console.log("get category by restaurant id: ", msg);
  try {
    let restaurants = await Restaurant.findById(
      new mongoose.Types.ObjectId(msg.body.res_id)
    );
    await restaurants.populate("menu_category").execPopulate();
    console.log("find res");
    console.log(restaurants);
    if (restaurants && restaurants.menu_category.length > 0) {
      response.status = 200;
      restaurants.menu_category.forEach((obj) =>
        renameKey(obj, "_id", "category_id")
      );
      response.data = JSON.stringify(restaurants.menu_category);
      return callback(null, response);
    } else {
      response.status = 200;
      response.data = JSON.stringify({ status: "NO_RECORD" });
      return callback(null, response);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}

async function getCategoryByCategoryId(msg, callback) {
  var err = {};
  let response = {};
  console.log("get category by category id: ", msg);
  try {
    let category = await MenuCategory.findById(msg.body.category_id);
    if (category) {
      response.status = 200;
      //category.forEach((obj) => renameKey(obj, "_id", "category_id"));
      response.data = JSON.stringify(category);
      return callback(null, response);
    } else {
      response.status = 200;
      response.data = JSON.stringify({ status: "NO_RECORD" });
      return callback(null, response);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}

async function getItemByRestaurantId(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get items by restaurant id: ", msg);
  try {
    let restaurant = await Restaurant.findById(msg.body.res_id);
    await restaurant.populate("menu_item").execPopulate();
    console.log("i by r id");
    console.log(restaurant);
    if (restaurant && restaurant.menu_item.length > 0) {
      response.status = 200;
      restaurant.menu_item.forEach((obj) => renameKey(obj, "_id", "item_id"));
      response.data = JSON.stringify(restaurant.menu_item);
      return callback(null, response);
    } else {
      response.status = 401;
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

async function addItem(msg, callback) {
  let err = {};
  let response = {};
  console.log("Add item: ", msg);
  try {
    let category = await MenuCategory.findOne({
      category_name: msg.body.item_category,
    });
    var savedCategory = category;
    if (!category) {
      let restaurant = await Restaurant.findById(msg.body.restaurant_id);
      if (restaurant) {
        let newCategory = new MenuCategory({
          category_name: msg.body.item_category,
        });
        newCategory.restaurants.push(restaurant._id);
        savedCategory = await newCategory.save();
        restaurant.menu_category.push(savedCategory._id);
        let savedRes = await restaurant.save();
        if (!savedRes) {
          response.status = 500;
          response.data = "Data error";
          return callback(null, response);
        }
      } else {
        response.status = 500;
        response.data = "Data error";
        return callback(null, response);
      }
    }
    //let sql = `CALL update_item('${item_id}', '${req.body.item_name}', '${req.body.item_description}', '${req.body.item_ingredients}',
    //'${req.body.item_price}', '${req.body.restaurant_id}', '${result[0][0].category_id}', '${req.body.item_image}');`;

    let restaurant = await Restaurant.findById(msg.body.restaurant_id);
    if (!restaurant) {
      response.status = 500;
      response.data = "Data error";
      return callback(null, response);
    }

    if (restaurant.menu_category.indexOf(category._id) === -1) {
      restaurant.menu_category.push(category._id);
    }

    if (msg.body.item_id != null) {
      // update
      let item = await MenuItem.findById(msg.body.item_id);
      if (item) {
        /*p_item_name VARCHAR(255),
        item_description VARCHAR(255),
        item_ingredients VARCHAR(255),
        item_price INT,
        restaurant_id INT,
        menu_category_id INT,
        item_image VARCHAR(255)*/
        item.item_name = msg.body.item_name;
        item.item_description = msg.body.item_description;
        item.item_price = msg.body.item_price;
        item.item_image = msg.body.item_image;
        item.item_ingredients = msg.body.item_ingredients;
        item.item_category = savedCategory._id;
        let savedItem = await item.save();
        if (savedItem) {
          response.status = 200;
          response.data = JSON.stringify({
            data: savedItem,
            status: "ITEM_UPDATED",
          });
          return callback(null, response);
        } else {
          response.status = 500;
          response.data = "Data error";
          return callback(null, response);
        }
      } else {
        response.status = 500;
        response.data = "NO_RECORD";
        return callback(null, response);
      }
    } else {
      let item = new MenuItem({
        item_name: msg.body.item_name,
        item_description: msg.body.item_description,
        item_price: msg.body.item_price,
        item_image: msg.body.item_image,
        item_ingredients: msg.body.item_ingredients,
        item_category: savedCategory._id,
      });
      item.restaurants.push(restaurant._id);
      let savedItem = await item.save();
      if (savedItem) {
        restaurant.menu_item.push(savedItem._id);
        let savedRes = await restaurant.save();
        if (savedRes) {
          response.status = 200;
          response.data = JSON.stringify({
            data: savedItem,
            status: "ITEM_ADDED",
          });
          return callback(null, response);
        } else {
          response.status = 500;
          response.data = "Data error";
          return callback(null, response);
        }
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
