const express = require("express");
const router = express.Router();
const pool = require("../mysqlDB.js");
const path = require("path");
const fs = require("fs");
const kafka = require("../kafka/client");
const { checkAuth } = require("../config/passport");

router.get("/category/:res_id", checkAuth, (req, res) => {
  console.log("get category " + req.params.res_id);
  kafka.make_request(
    "menu-topic",
    { path: "category_by_restaurant_id", body: req.params },
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

router.get("/categoryById/:category_id", checkAuth, (req, res) => {
  console.log("get category by id " + req.params.category_id);
  kafka.make_request(
    "menu-topic",
    { path: "category_by_category_id", body: req.params },
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

router.get("/items/:res_id", checkAuth, (req, res) => {
  console.log("get items " + req.params.res_id);
  kafka.make_request(
    "menu-topic",
    { path: "item_by_restaurant_id", body: req.params },
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

router.post("/item", checkAuth, (req, res) => {
  console.log("post item");
  console.log(req.body);
  kafka.make_request(
    "menu-topic",
    { path: "add_item", body: req.body },
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
