const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Product.find()
    .select("_id name price")
    .exec()
    .then((result) => {
      const response = {
        count: result.length,
        products: result.map((r) => {
          return {
            name: r.name,
            price: r.price,
            _id: r._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + r._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res, next) => {
  console.log(req.body);

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product Created",
        createdProduct: {
          product: {
            name: result.name,
            price: result.price,
            _id: result._id,
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("_id name price")
    .exec()
    .then((result) => {
      console.log(result);
      if (result) {
        const response = {
          product: result,
          request: {
            type: "GET",
            description: "get all Products",
            url: "http://localhost:3000/products/",
          },
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          error: "Product not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const productId = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: productId }, { $set: updateOps })
    .then((result) => {
      const response = {
        message: "Product Updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + productId,
        },
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  const productId = req.params.productId;
  Product.remove({ _id: productId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products/",
          body: {
            name: "String",
            price: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});
module.exports = router;
