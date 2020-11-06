"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const orderSchema = new schema(
  {
    order_type: {
      type: String,
      trim: true,
      required: true,
    },
    order_status: {
      type: String,
      trim: true,
      required: true,
    },
    order_delivery_status: {
      type: String,
      trim: true,
      required: true,
    },
    order_date: {
      type: Date,
      required: true,
      required: true,
    },
    order_cost: {
      type: Number,
      trim: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    order_item: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        item_quantity: {
          type: Number,
        },
      },
    ],
  },

  { versionKey: false }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
