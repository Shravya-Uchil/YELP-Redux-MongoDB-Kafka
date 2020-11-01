"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const reviewSchema = new schema(
  {
    review_text: {
      type: String,
      trim: true,
      required: true,
    },
    review_date: {
      type: Date,
      required: true,
    },
    review_rating: {
      type: Number,
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  { versionKey: false }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
