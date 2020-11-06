"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const eventSchema = new schema(
  {
    event_name: {
      type: String,
      trim: true,
      required: true,
    },
    event_description: {
      type: String,
      trim: true,
    },
    event_time: {
      type: String,
      trim: true,
      required: true,
    },
    event_date: {
      type: Date,
      required: true,
    },
    event_hashtag: {
      type: String,
      trim: true,
    },
    event_location: {
      type: String,
      trim: true,
      required: true,
    },
    event_image: {
      type: String,
      trim: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    customer_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
    ],
  },
  { versionKey: false }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
