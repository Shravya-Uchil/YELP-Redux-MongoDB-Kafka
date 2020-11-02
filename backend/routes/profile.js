const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../mysqlDB.js");
const kafka = require("../kafka/client");

router.get("/customer/:email_id", (req, res) => {
  kafka.make_request(
    "customer-topic",
    { path: "customer_email", body: req.params },
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

router.get("/customerById/:cust_id", (req, res) => {
  kafka.make_request(
    "customer-topic",
    { path: "customer_id", body: req.params },
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

router.post("/customer", async (req, res) => {
  var encryptedPassword = "NULL";
  try {
    if (req.body.password && req.body.password !== "") {
      encryptedPassword =
        "'" + (await bcrypt.hash(req.body.password, 12)) + "'";
    }
    let sql = `CALL update_customer('${req.body.email_id}', '${req.body.cust_name}', ${encryptedPassword}, '${req.body.city}', '${req.body.state}', '${req.body.country}', '${req.body.nick_name}', '${req.body.headline}', 
    '${req.body.yelp_since}','${req.body.dob}','${req.body.things_love}','${req.body.find_me}','${req.body.blog_website}','${req.body.phone_number}');`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log("Error:");
        console.log(err);
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("Error in Data");
      }
      if (
        result &&
        result.length > 0 &&
        result[0][0].status === "CUSTOMER_UPDATED"
      ) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(result[0][0].status);
      } else if (
        result &&
        result.length > 0 &&
        result[0][0].status === "NO_RECORD"
      ) {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end(result[0][0].status);
      }
    });
  } catch (err) {
    console.log("Error in encryption:");
    console.log(err);
    res.writeHead(500, {
      "Content-Type": "text/plain",
    });
    res.end("Error in encrypting password!!");
  }
});

router.get("/restaurant/:restaurant_id", (req, res) => {
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

router.post("/restaurant", async (req, res) => {
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

module.exports = router;
