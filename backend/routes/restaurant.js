const express = require("express");
const router = express.Router();
//const bcrypt = require("bcrypt");
//const db = require("../mysqlDB.js");
const kafka = require("../kafka/client");
const { checkAuth } = require("../config/passport");

router.get("/search/:search_str", checkAuth, (req, res) => {
  console.log("Search restaurants");
  kafka.make_request(
    "restaurant-topic",
    { path: "search", body: req.params },
    function (err, results) {
      console.log(" make request for search : err");
      console.log(err);
      console.log(" make request for search : results");
      console.log(results);
      if (err) {
        console.log("error");
        console.log(err);
        res.writeHead(err.status, {
          "Content-Type": "text/plain",
        });
        res.end(err.data);
      } else {
        console.log("done");
        res.writeHead(results.status, {
          "Content-Type": "text/plain",
        });
        res.end(results.data);
      }
    }
  );
});

router.get("/restaurant/:restaurant_id", checkAuth, (req, res) => {
  console.log("get restaurant by id");
  kafka.make_request(
    "restaurant-topic",
    { path: "restaurant", body: req.params },
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

router.post("/restaurant", checkAuth, async (req, res) => {
  console.log("Update restaurant profile");
  kafka.make_request(
    "restaurant-topic",
    { path: "update_restaurant", body: req.body },
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

router.get("/restaurantReview/:restaurant_id", checkAuth, (req, res) => {
  console.log("Get restaurant reviews by id:");
  console.log(req.params);
  kafka.make_request(
    "restaurant-topic",
    { path: "restaurant_review", body: req.params },
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

router.post("/restaurantReview", checkAuth, async (req, res) => {
  console.log("Add review");
  kafka.make_request(
    "restaurant-topic",
    { path: "add_restaurant_review", body: req.body },
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
  "/hasReviewed/:customer_id/:restaurant_id",
  checkAuth,
  (req, res) => {
    console.log("Has reviewed");
    kafka.make_request(
      "restaurant-topic",
      { path: "has_reviewed", body: req.params },
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

module.exports = router;
