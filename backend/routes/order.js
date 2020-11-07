const express = require("express");
const router = express.Router();
const db = require("../mysqlDB.js");
const kafka = require("../kafka/client");
const { checkAuth } = require("../config/passport");

router.post("/customer/placeorder", checkAuth, (req, res) => {
  console.log("place order");
  kafka.make_request(
    "order-topic",
    { path: "place_order", body: req.body },
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
  /*let sql = `CALL add_order('${req.body.customer_id}', '${req.body.restaurant_id}', '${req.body.order_status}','${req.body.order_cost}', '${req.body.order_type}', '${req.body.order_delivery_status}');`;
  db.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Database Error");
    }
    if (result && result.length > 0 && result[0][0].status === "ORDER_PLACED") {
      req.body.cart_items.forEach((cart_item) => {
        let sql2 = `CALL add_order_items(${result[0][0].order_id}, ${cart_item.item_id}, ${cart_item.item_quantity});`;
        db.query(sql2, (err, result) => {
          if (err) {
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end("Database Error");
          }
        });
      });
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(JSON.stringify(result[0][0]));
    } else {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end(result[0][0]);
    }
  });*/
});

router.get("/customer/allOrders/:customer_id", checkAuth, (req, res) => {
  console.log("Get all orders for customer id");
  kafka.make_request(
    "order-topic",
    { path: "all_orders_by_customer_id", body: req.params },
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

router.get("/restaurant/allOrders/:restaurant_id", checkAuth, (req, res) => {
  console.log("Get all orders for restaurant id");
  kafka.make_request(
    "order-topic",
    { path: "all_orders_by_restaurant_id", body: req.params },
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

router.get("/orderitems/:order_id", checkAuth, (req, res) => {
  console.log("Get order items");
  kafka.make_request(
    "order-topic",
    { path: "order_items_by_order_id", body: req.params },
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

router.post("/restaurant/updateOrderStatus", checkAuth, (req, res) => {
  console.log("Update order status");
  kafka.make_request(
    "order-topic",
    { path: "update_order_status", body: req.body },
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

router.post("/restaurant/updateDeliveryStatus", checkAuth, (req, res) => {
  console.log("Update delivery status");
  kafka.make_request(
    "order-topic",
    { path: "update_delivery_status", body: req.body },
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
