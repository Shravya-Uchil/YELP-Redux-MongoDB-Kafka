const express = require("express");
const router = express.Router();
//const bcrypt = require("bcrypt");
//const pool = require("../mysqlDB.js");
const kafka = require("../kafka/client");

router.post("/customer", async (req, res) => {
  console.log("POST customer");
  kafka.make_request(
    "signup-topic",
    { path: "customer_signup", body: req.body },
    function (err, results) {
      if (err) {
        console.log(err);
        return res.status(err.status).send(err.data);
      } else {
        return res.status(results.status).send(results.data);
      }
    }
  );
});

router.post("/restaurant", async (req, res) => {
  console.log("POST restaurant");
  kafka.make_request(
    "signup-topic",
    { path: "restaurant_signup", body: req.body },
    function (err, results) {
      if (err) {
        console.log(err);
        return res.status(err.status).send(err.data);
      } else {
        return res.status(results.status).send(results.data);
      }
    }
  );
  /*var encryptedPassword;
  try {
    encryptedPassword = await bcrypt.hash(req.body.password, 12);
    let sql_query = `CALL register_restaurant('${req.body.restaurant_name}', '${req.body.zip_code}', '${req.body.email_id}', '${encryptedPassword}', '${req.body.lat}', '${req.body.lng}');`;

    pool.query(sql_query, (err, result) => {
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
        result[0][0].status === "RESTAURANT_ADDED"
      ) {
        console.log("Success:");
        console.log(result);
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(result[0][0].status);
      } else if (
        result &&
        result.length > 0 &&
        result[0][0].status === "RESTAURANT_EXISTS"
      ) {
        console.log("Already exists:");
        console.log(result);
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
  }*/
});

module.exports = router;
