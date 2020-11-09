const express = require("express");
const router = express.Router();
//const db = require("../mysqlDB.js");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const kafka = require("../kafka/client");
const { checkAuth } = require("../config/passport");

const customerStorage = multer.diskStorage({
  destination: path.join(__dirname, "..") + "/public/uploads/customer",
  filename: (req, file, cb) => {
    cb(
      null,
      "customer" +
        req.params.customer_id +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const customerUpload = multer({
  storage: customerStorage,
  limits: { fileSize: 1000000 },
}).single("cust_image");

router.post("/customer/:customer_id", checkAuth, (req, res) => {
  customerUpload(req, res, function (err) {
    if (!err) {
      kafka.make_request(
        "image-topic",
        {
          path: "upload_customer_image",
          body: req.params,
          filename: req.file.filename,
        },
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
    } else {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Error uploading image");
    }
  });
});

router.get("/customer/:cust_image", (req, res) => {
  var image =
    path.join(__dirname, "..") +
    "/public/uploads/customer/" +
    req.params.cust_image;
  if (fs.existsSync(image)) {
    res.sendFile(image);
  } else {
    res.sendFile(
      path.join(__dirname, "..") +
        "/public/uploads/customer/customer_default.png"
    );
  }
});

const restaurantStorage = multer.diskStorage({
  destination: path.join(__dirname, "..") + "/public/uploads/restaurant",
  filename: (req, file, cb) => {
    cb(
      null,
      "restaurant" +
        req.params.restaurant_id +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const restaurantUpload = multer({
  storage: restaurantStorage,
  limits: { fileSize: 1000000 },
}).single("res_image");

router.post("/restaurant/:restaurant_id", checkAuth, (req, res) => {
  restaurantUpload(req, res, function (err) {
    if (!err) {
      kafka.make_request(
        "image-topic",
        {
          path: "upload_restaurant_image",
          body: req.params,
          filename: req.file.filename,
        },
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
    } else {
      console.log("Error!");
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Error uploading image");
    }
  });
});

router.get("/restaurant/:restaurant_image", (req, res) => {
  console.log("Get restaurant image");
  console.log(req);
  var image =
    path.join(__dirname, "..") +
    "/public/uploads/restaurant/" +
    req.params.restaurant_image;
  if (fs.existsSync(image)) {
    res.sendFile(image);
  } else {
    res.sendFile(
      path.join(__dirname, "..") +
        "/public/uploads/restaurant/restaurant_default.jpg"
    );
  }
});

const itemStorage = multer.diskStorage({
  destination: path.join(__dirname, "..") + "/public/uploads/item",
  filename: (req, file, cb) => {
    cb(null, "item" + Date.now() + path.extname(file.originalname));
  },
});

const itemUpload = multer({
  storage: itemStorage,
  limits: { fileSize: 1000000 },
}).single("item_image");

router.post("/item/:item_id", checkAuth, (req, res) => {
  itemUpload(req, res, function (err) {
    if (!err) {
      kafka.make_request(
        "image-topic",
        {
          path: "upload_item_image",
          body: req.params,
          filename: req.file.filename,
        },
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
    } else {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Error uploading image");
    }
  });
});

router.get("/item/:item_image", (req, res) => {
  var image =
    path.join(__dirname, "..") +
    "/public/uploads/item/" +
    req.params.item_image;
  if (fs.existsSync(image)) {
    res.sendFile(image);
  } else {
    res.sendFile(
      path.join(__dirname, "..") + "/public/uploads/item/item_default.jpg"
    );
  }
});

const eventStorage = multer.diskStorage({
  destination: path.join(__dirname, "..") + "/public/uploads/event",
  filename: (req, file, cb) => {
    cb(null, "event" + Date.now() + path.extname(file.originalname));
  },
});

const eventUpload = multer({
  storage: eventStorage,
  limits: { fileSize: 1000000 },
}).single("eventimage");

router.post("/event/:event_id", checkAuth, (req, res) => {
  eventUpload(req, res, function (err) {
    if (!err) {
      if (req.params.event_id !== "undefined") {
        let sql = `UPDATE event SET event_image = '${req.file.filename}' WHERE event_id = ${req.params.event_id}`;

        db.query(sql, (err, result) => {
          if (err) {
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end("Database Error");
          }
        });
      }
      res.writeHead(200, {
        "Context-Type": "text/plain",
      });
      res.end(req.file.filename);
    } else {
      console.log(err);
    }
  });
});

router.get("/event/:event_image", (req, res) => {
  var image =
    path.join(__dirname, "..") +
    "/public/uploads/event/" +
    req.params.event_image;
  if (fs.existsSync(image)) {
    res.sendFile(image);
  } else {
    res.sendFile(
      path.join(__dirname, "..") + "/public/uploads/event/event_default.png"
    );
  }
});

module.exports = router;
