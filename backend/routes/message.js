const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const kafka = require("../kafka/client");
const { checkAuth } = require("../config/passport");

router.get("/getMessagesCustomer/:customer_id", checkAuth, (req, res) => {
  console.log("get all messages for customer");
  kafka.make_request(
    "message-topic",
    { path: "all_messages_customer", body: req.params },
    function (err, results) {
      if (err) {
        console.log(err);
        res.writeHead(err.status, {
          "Content-Type": "text/plain",
        });
        res.end(err.data);
      } else {
        res.writeHead(results.status, {
          "Content-Type": "text/plain",
        });
        res.end(results.data);
      }
    }
  );
});

router.get("/getMessagesRestaurant/:restaurant_id", checkAuth, (req, res) => {
  console.log("get all messages for restaurant");
  kafka.make_request(
    "message-topic",
    { path: "all_messages_restaurant", body: req.params },
    function (err, results) {
      if (err) {
        console.log(err);
        res.writeHead(err.status, {
          "Content-Type": "text/plain",
        });
        res.end(err.data);
      } else {
        res.writeHead(results.status, {
          "Content-Type": "text/plain",
        });
        res.end(results.data);
      }
    }
  );
});

router.get(
  "/getMessageDetails/:restaurant_id/:customer_id",
  checkAuth,
  (req, res) => {
    console.log("get messages details");
    console.log(req.params);
    kafka.make_request(
      "message-topic",
      { path: "message_details", body: req.params },
      function (err, results) {
        if (err) {
          console.log(err);
          res.writeHead(err.status, {
            "Content-Type": "text/plain",
          });
          res.end(err.data);
        } else {
          res.writeHead(results.status, {
            "Content-Type": "text/plain",
          });
          res.end(results.data);
        }
      }
    );
  }
);

router.post("/sendMessage", checkAuth, (req, res) => {
  kafka.make_request(
    "message-topic",
    { path: "send_message", body: req.body },
    function (err, results) {
      if (err) {
        console.log(err);
        res.writeHead(err.status, {
          "Content-Type": "text/plain",
        });
        res.end(err.data);
      } else {
        res.writeHead(results.status, {
          "Content-Type": "text/plain",
        });
        res.end(results.data);
      }
    }
  );
});

module.exports = router;
