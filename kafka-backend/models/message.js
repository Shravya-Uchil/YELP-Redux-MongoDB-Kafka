"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const messageSchema = new schema(
  {
    message_array: [
      {
        message_text: {
          type: String,
          trim: true,
          required: true,
        },
        message_date: {
          type: Date,
          required: true,
        },
        from: {
          type: String,
          required: true,
        },
      },
    ],
    start_date: {
      type: Date,
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

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
