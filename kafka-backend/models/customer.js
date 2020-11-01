"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const customerSchema = new schema(
  {
    cust_name: {
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
    phone_number: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    cust_image: {
      type: String,
      trim: true,
      default: "default",
    },
    dob: {
      type: Date,
    },
    nick_name: {
      type: String,
      trim: true,
      default: "",
    },
    headline: {
      type: String,
      trim: true,
      default: "",
    },
    yelp_since: {
      type: Date,
    },
    things_love: {
      type: String,
      trim: true,
      default: "",
    },
    find_me: {
      type: String,
      trim: true,
      default: "",
    },
    blog_website: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { versionKey: false }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
