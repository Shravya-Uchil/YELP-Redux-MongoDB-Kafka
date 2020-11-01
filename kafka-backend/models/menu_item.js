"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const menuItemSchema = new schema(
  {
    item_name: {
      type: String,
      trim: true,
      required: true,
    },
    item_price: {
      type: Number,
      required: true,
    },
    item_description: {
      type: String,
      trim: true,
    },
    item_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
    },
    item_image: {
      type: String,
      trim: true,
      default: "default",
    },
    item_ingredients: {
      type: String,
      trim: true,
    },
    restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
  },
  { versionKey: false }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
