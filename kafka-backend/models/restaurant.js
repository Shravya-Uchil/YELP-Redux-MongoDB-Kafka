"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const restaurantSchema = new schema(
  {
    restaurant_name: {
      type: String,
      trim: true,
      required: true,
    },
    email_id: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    zip_code: {
      type: String,
      trim: true,
      required: true,
    },
    phone_number: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    open_time: {
      type: String,
      trim: true,
      default: "",
    },
    close_time: {
      type: String,
      trim: true,
      default: "",
    },
    cuisine: {
      type: String,
      trim: true,
      default: "",
    },
    curbside_pickup: {
      type: Boolean,
      default: true,
    },
    dine_in: {
      type: Boolean,
      default: true,
    },
    yelp_delivery: {
      type: Boolean,
      default: true,
    },
    restaurant_image: {
      type: String,
      trim: true,
      default: "default",
    },
    lat: {
      type: Number,
      default: 0.0,
    },
    lng: {
      type: Number,
      default: 0.0,
    },
    menu_item: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
    menu_category: [
      { type: mongoose.Schema.Types.ObjectId, ref: "MenuCategory" },
    ],
    event: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    order: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { versionKey: false }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
