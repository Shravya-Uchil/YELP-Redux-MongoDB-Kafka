const express = require("express");
const router = express.Router();
const pool = require("../mysqlDB.js");
const path = require("path");
const fs = require("fs");
const kafka = require("../kafka/client");
const { checkAuth } = require("../config/passport");

router.get("/all", checkAuth, (req, res) => {
  console.log("get all events");
  kafka.make_request("event-topic", { path: "all_events" }, function (
    err,
    results
  ) {
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
  });
});

router.get("/:event_name", checkAuth, (req, res) => {
  console.log("get event " + req.params.event_name);
  kafka.make_request(
    "event-topic",
    { path: "event_name", body: req.params },
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

router.get("/restaurant/:res_id", checkAuth, (req, res) => {
  console.log("get event " + req.params.res_id);
  kafka.make_request(
    "event-topic",
    { path: "event_by_restaurant_id", body: req.params },
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

router.post("/event", checkAuth, (req, res) => {
  console.log("post event");
  console.log(req.body);
  kafka.make_request(
    "event-topic",
    { path: "create_event", body: req.body },
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

router.post("/register", checkAuth, (req, res) => {
  console.log("post register");
  console.log(req.body);
  kafka.make_request(
    "event-topic",
    { path: "register_event_by_customer_id", body: req.body },
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

router.get("/customer/registration/:customer_id", checkAuth, (req, res) => {
  console.log("get cust reg event " + req.params.customer_id);
  kafka.make_request(
    "event-topic",
    { path: "get_registered_events_by_customer_id", body: req.params },
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
  "/customer/isRegistered/:customer_id/:event_id",
  checkAuth,
  (req, res) => {
    console.log(
      "get is evt registered " +
        req.params.customer_id +
        " , " +
        req.params.event_id
    );
    kafka.make_request(
      "event-topic",
      { path: "is_registered", body: req.params },
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

router.get("/restaurant/registration/:event_id", checkAuth, (req, res) => {
  console.log("get registered customers for" + req.params.event_id);
  kafka.make_request(
    "event-topic",
    { path: "get_registered_customers_by_event_id", body: req.params },
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
