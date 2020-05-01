const express = require("express");
const app = express();
const productRoutes = require("./api/routes/products/products");
const orderRoutes = require("./api/routes/orders/orders");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect(
  //   "mongodb://node-user-rr:LNMgtfpJb9U4Mrk@cluster0-aosei.mongodb.net/test?retryWrites=true&w=majority"
  "mongodb+srv://node-user-rr:LNMgtfpJb9U4Mrk@cluster0-aosei.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "*");
    res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: error.message,
  });
});
module.exports = app;
