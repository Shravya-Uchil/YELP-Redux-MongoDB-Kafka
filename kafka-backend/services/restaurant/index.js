"use strict";
const Restaurant = require("../../models/restaurant");
const Customer = require("../../models/customer");
const MenuItem = require("../../models/menu_item");
const MenuCategory = require("../../models/menu_category");
const Review = require("../../models/review");

let handle_request = async (msg, callback) => {
  console.log("Restaurant service, path= ", msg.path);
  switch (msg.path) {
    case "search":
      searchRestaurant(msg, callback);
      break;
    case "restaurant":
      getRestaurantById(msg, callback);
      break;
    case "update_restaurant":
      updateRestaurant(msg, callback);
      break;
    case "restaurant_review":
      getRestaurantReviewById(msg, callback);
      break;
    case "add_restaurant_review":
      addRestaurantReview(msg, callback);
      break;
    case "has_reviewed":
      hasReviewed(msg, callback);
      break;
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

function renameKey(obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

async function searchRestaurant(msg, callback) {
  var err = {};
  let response = {};
  console.log("Search restaurant: ", msg);
  try {
    let restaurant = null;
    if (msg.body.search_str != "_") {
      console.log("inside seach_str !=0");
      restaurant = await Restaurant.find({
        $or: [
          { restaurant_name: new RegExp(msg.body.search_str, "gi") },
          { description: new RegExp(msg.body.search_str, "gi") },
          { cuisine: new RegExp(msg.body.search_str, "gi") },
        ],
      });
      await restaurant
        .populate({
          path: "menu_category",
          match: { category_name: new RegExp(msg.body.search_str, "gi") },
          select: "category_name _id",
        })
        .populate({
          path: "menu_item",
          match: {
            $OR: [
              { item_name: new RegExp(msg.body.search_str, "gi") },
              { item_description: new RegExp(msg.body.search_str, "gi") },
            ],
          },
          select:
            "item_name item_price item_description item_category item_image item_ingredients _id",
        })
        .execPopulate();
    } else {
      console.log("Find all restaurants");
      restaurant = await Restaurant.find();
    }
    if (restaurant && restaurant.length > 0) {
      console.log("Found restaurants... ");
      response.status = 200;
      restaurant.forEach((obj) => renameKey(obj, "_id", "restaurant_id"));
      response.data = JSON.stringify(restaurant);
      return callback(null, response);
    } else {
      console.log("no_record");
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

async function getRestaurantById(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get restaurant by id: ", msg);
  try {
    let restaurant = await Restaurant.findById(msg.body.restaurant_id);
    if (restaurant) {
      response.status = 200;
      //console.log("BLAAA");
      //console.log(restaurant);
      //restaurant[`restaurant_id`] = restaurant[`_id`];
      //delete restaurant[`_id`];
      //let arr = [restaurant];
      //arr.forEach((obj) => renameKey(obj, "_id", "restaurant_id"));
      //renameKey(restaurant, "_id", "restaurant_id");
      //console.log(arr[0]);
      response.data = JSON.stringify(restaurant);
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

async function updateRestaurant(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get restaurant by id: ", msg);
  try {
    let restaurantObj = await Restaurant.findById(msg.body.restaurant_id);

    if (restaurantObj) {
      restaurantObj.restaurant_name =
        restaurantObj.restaurant_name || msg.body.restaurant_name;
      restaurantObj.zip_code = restaurantObj.zip_code || msg.body.zip_code;
      restaurantObj.contact = msg.body.contact;
      restaurantObj.description = msg.body.description;
      restaurantObj.cuisine = msg.body.cuisine;
      restaurantObj.curbside_pickup = msg.body.curbside_pickup;
      restaurantObj.dine_in = msg.body.dine_in;
      restaurantObj.yelp_delivery = msg.body.yelp_delivery;

      if (msg.body.password && msg.body.password !== "") {
        restaurantObj.password = await bcrypt.hash(msg.body.password, 12);
      }
      const updatedRestaurant = await restaurantObj.save();
      if (updatedRestaurant) {
        response.status = 200;
        response.data = "RESTAURANT_UPDATED";
        return callback(null, response);
      } else {
        response.status = 500;
        response.data = "Error in saving data";
        return callback(null, response);
      }
    } else {
      console.log(error);
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

async function getRestaurantReviewById(msg, callback) {
  let err = {};
  let response = {};
  console.log("Get restaurant review by id: ", msg);
  try {
    let restaurant = await Restaurant.findById(msg.body.restaurant_id);
    if (restaurant) {
      let review = await Review.find({
        restaurant_id: restaurant._id,
      });
      if (review) {
        response.status = 200;
        review.forEach((obj) => renameKey(obj, "_id", "review_id"));
        response.data = JSON.stringify(review);
        return callback(null, response);
      } else {
        response.status = 200;
        response.data = "NO_RECORD";
        return callback(null, response);
      }
    } else {
      response.status = 500;
      response.data = "Data error";
      return callback(null, response);
    }
  } catch (error) {
    console.log(error);
    err.status = 500;
    err.data = "Error in Data";
    return callback(err, null);
  }
}

async function addRestaurantReview(msg, callback) {
  let err = {};
  let response = {};
  console.log("Add restaurant review: ", msg);
  try {
    //let sql = `CALL add_review('${req.body.review_text}', '${req.body.review_rating}', '${req.body.restaurant_id}' ,'${req.body.customer_id}');`;
    let restaurant = await Restaurant.findById(msg.restaurant_id);
    let customer = await Customer.findById(msg.customer_id);
    if (!restaurant || !customer) {
      response.status = 500;
      response.data = "No restaurant or customer found";
      return callback(null, response);
    } else {
      let reviewExists = await Review.findOne({
        $and: [
          { restaurant_id: restaurant.restaurant_id },
          { customer_id: customer.customer_id },
        ],
      });

      if (!reviewExists) {
        let review = new Review({
          review_text: msg.body.review_text,
          review_date: msg.body.review_date,
          review_rating: msg.body.review_rating,
          customer_id: customer._id,
          restaurant_id: restaurant._id,
        });
        let addedReview = await review.save();
        if (addedReview) {
          response.status = 200;
          response.data = "REVIEW_ADDED";
          return callback(null, response);
        } else {
          response.status = 500;
          response.data = "Error in Data";
          return callback(null, response);
        }
      } else {
        response.status = 200;
        response.data = "RESTAURANT_EXISTS";
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

async function hasReviewed(msg, callback) {
  let err = {};
  let response = {};
  console.log("Has customer reviewed: ", msg);
  try {
    let review = await Review.findOne({
      $and: [
        { restaurant_id: msg.body.restaurant_id },
        { customer_id: msg.body.customer_id },
      ],
    });

    if (review) {
      response.status = 200;
      renameKey(review, "_id", "review_id");
      response.data = JSON.stringify(review);
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
