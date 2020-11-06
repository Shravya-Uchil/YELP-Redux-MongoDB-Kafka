const express = require("express");
const router = express.Router();

// Authentication
var jwt = require("jsonwebtoken");
// var passport = require("passport");
const { secret } = require("../config/config");
// var requireAuth = passport.authenticate("jwt", { session: false });

//const bcrypt = require("bcrypt");
//const db = require("../mysqlDB.js");
const kafka = require("../kafka/client");
const { auth } = require("../config/passport");
auth();

router.post("/customer", (req, res) => {
  console.log("Customer login");
  kafka.make_request(
    "login-topic",
    { path: "customer_login", body: req.body },
    function (err, results) {
      if (err) {
        console.log(err);
        res.writeHead(err.status, {
          "Content-Type": "text/plain",
        });
        res.end(err.data);
      } else {
        console.log("results");
        console.log(results);
        if (results.status === 200) {
          if (
            results.data === "INCORRECT_PASSWORD" ||
            results.data === "NO_CUSTOMER"
          ) {
            console.log("whaataa??");
            res.writeHead(results.status, {
              "Content-Type": "text/plain",
            });
            res.end(results.data);
          } else {
            /*var payload = {
              email_id: results.data.email_id,
              customer_id: results.data.customer_id,
              cust_name: results.data.cust_name,
              login_type: results.data.login_type,
            };*/
            const payload = results.data;
            console.log("******** login payload *********");
            //console.log(results.data);
            //console.log(payload);
            const token = jwt.sign(JSON.parse(payload), secret, {
              expiresIn: 7200, // expires in 2 hours
            });
            //var jwtToken = "JWT " + token;
            req.session.user = results.data.email_id;
            res.cookie("cookie", "admin", {
              maxAge: 900000,
              httpOnly: false,
              path: "/",
            });
            // res.setHeader(jwtToken);
            res.writeHead(results.status, {
              "Content-Type": "text/plain",
            });
            let data = {
              token: "JWT " + token,
            };
            res.end(JSON.stringify(data));
          }
        } else {
          res.writeHead(results.status, {
            "Content-Type": "text/plain",
          });
          res.end(results.data);
        }
      }
    }
  );
  /*let sql_query = `CALL get_user('${req.body.email_id}');`;

  db.query(sql_query, async (err, result) => {
    if (err) {
      console.log("Error:" + err);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.send("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status) {
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(
          req.body.password,
          result[0][0].password
        );
        if (isValidPassword === true) {
          req.session.user = req.body.email_id;
          res.cookie("cookie", "admin", {
            maxAge: 900000,
            httpOnly: false,
            path: "/",
          });
          let customerObject = {
            customer_id: result[0][0].customer_id,
            cust_name: result[0][0].name,
            email_id: result[0][0].email_id,
            password: result[0][0].password,
            login_type: 0,
          };
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end(JSON.stringify(customerObject));
        } else {
          res.writeHead(401, {
            "Content-Type": "text/plain",
          });
          res.end("INCORRECT_PASSWORD");
        }
      } catch (err) {
        console.log("Error in encryption:");
        console.log(err);
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("Error in encrypting password!!");
      }
    } else {
      console.log("No customer found");
      res.writeHead(401, {
        "Content-Type": "text/plain",
      });
      res.end("NO_CUSTOMER");
    }
  });*/
});

router.post("/restaurant", (req, res) => {
  console.log("Restaurant login");
  kafka.make_request(
    "login-topic",
    { path: "restaurant_login", body: req.body },
    function (err, results) {
      if (err) {
        console.log(err);
        res.writeHead(err.status, {
          "Content-Type": "text/plain",
        });
        res.end(err.data);
      } else {
        console.log(results);
        if (results.status === 200) {
          if (
            results.data === "INCORRECT_PASSWORD" ||
            results.data === "NO_CUSTOMER"
          ) {
            res.writeHead(results.status, {
              "Content-Type": "text/plain",
            });
            res.end(results.data);
          } else {
            /*const payload = {
              email_id: results.data.email_id,
              customer_id: results.data.customer_id,
              cust_name: results.data.cust_name,
              login_type: results.data.login_type,
            };*/
            const payload = results.data;
            console.log("******** login payload *********");
            console.log(payload);
            const token = jwt.sign(JSON.parse(payload), secret, {
              expiresIn: 7200, // expires in 2 hours
            });
            //var jwtToken = "JWT " + token;
            req.session.user = results.data.email_id;
            res.cookie("cookie", "admin", {
              maxAge: 900000,
              httpOnly: false,
              path: "/",
            });
            // res.setHeader(jwtToken);
            res.writeHead(results.status, {
              "Content-Type": "text/plain",
            });
            let data = {
              token: "JWT " + token,
            };
            res.end(JSON.stringify(data));
          }
        } else {
          res.writeHead(results.status, {
            "Content-Type": "text/plain",
          });
          res.end(results.data);
        }
      }
    }
  );
  /*let sql_query = `CALL get_restaurant('${req.body.email_id}');`;
  db.query(sql_query, async (err, result) => {
    console.log("result:" + result);
    if (err) {
      console.log("Error:" + err);
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.send("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status) {
      let isValidPassword = false;
      try {
        isValidPassword = await bcrypt.compare(
          req.body.password,
          result[0][0].password
        );
        if (isValidPassword === true) {
          req.session.user = req.body.email_id;
          res.cookie("cookie", "admin", {
            maxAge: 900000,
            httpOnly: false,
            path: "/",
          });
          let restaurantObject = {
            customer_id: result[0][0].restaurant_id,
            cust_name: result[0][0].restaurant_name,
            email_id: result[0][0].email_id,
            password: result[0][0].password,
            login_type: 1,
          };
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end(JSON.stringify(restaurantObject));
        } else {
          res.writeHead(401, {
            "Content-Type": "text/plain",
          });
          res.end("INCORRECT_PASSWORD");
        }
      } catch (err) {
        console.log("Error in encryption:");
        console.log(err);
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("Error in encrypting password!!");
      }
    } else {
      console.log("No restaurant found");
      res.writeHead(401, {
        "Content-Type": "text/plain",
      });
      res.end("NO_CUSTOMER");
    }
  });*/
});

module.exports = router;
