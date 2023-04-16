const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
// const User = require("../../model/User");
const Stock = require("../../model/Stock");
const Image = require("../../model/Image");
const key = require("../../config/keys").secret;

/**
 * @route POST api/stocks/add_stock
 * @desc Adding item to stock
 * @access Public
 */
router.post("/add_stock", async (req, res) => {
  let {
    detail,
    barid,
    beid,
    disc,
    discper,
    jmid,
    qty,
    priceperu,
    taxactive,
    imagename,
  } = req.body;

  let newStock = new Stock({
    detail,
    barid,
    beid,
    disc,
    discper,
    jmid,
    qty,
    priceperu,
    taxactive,
    imagename,
  });

  newStock
    .save()
    .then((item) => {
      console.log(item);
      return res.status(201).json({
        success: true,
        msg: "Item has been added",
      });
    })
    .catch((err) => {
      return res.status(404).json({
        success: false,
        msg: err,
      });
    });
});

/**
 * @router GET api/stocks/get_stock
 * @desc Get the items in the stock
 * @access Public
 */
router.get("/get_stock", (req, res) => {
  Stock.find().then((stock) => {
    return res.json({
      stock: stock,
    });
  });
});

/**
 * @router Post api/stocks/delete_all_stocks
 * @desc Delete all stocks
 * @access Pivate
 */
router.post("/delete_all_stocks", (req, res) => {
  Stock.deleteMany().then(() => {
    return res.status(400).json({
      msg: "Deleted all invoices",
      success: true,
    });
  });
});

router.put("/order", (req, res) => {
  let { id, newqty } = req.body;
  Stock.findByIdAndUpdate(id, { qty: newqty }).then((updatedStock) => {
    return res.status(201).json({
      success: true,
      stock: updatedStock,
      msg: `Stock decrease to ${newqty}`
    })
  }).catch((err) => {
    return res.status(404).json({
      success: false,
      msg: err
    })
  });
});

module.exports = router;
