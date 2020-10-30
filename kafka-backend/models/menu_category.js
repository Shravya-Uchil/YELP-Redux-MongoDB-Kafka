"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const menuCategorySchema = new schema(
  {
    category_name: {
      type: String,
      trim: true,
    },
    restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }],
  },
  { versionKey: false }
);

const MenuCategory = mongoose.model("MenuCategory", menuCategorySchema);

module.exports = MenuCategory;
