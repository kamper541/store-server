const express = require("express");
const Invoice = require("../../model/Invoice");
const router = express.Router();
const User = require("../../model/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Stock = require("../../model/Stock");
const key = require("../../config/keys").secret;

/**
 * @route POST api/stocks/add_stock
 * @desc Adding item to stock
 * @access Public
 */
router.post("/add_invoice", async (req, res) => {
  let { customer_id, note, description, order_stock } = req.body;
  console.log(customer_id);
  User.findById(customer_id)
    .then((user) => {
      if (user) {
        console.log(user);
        let storename = user.storename;
        let newStock = new Invoice({
          customer_id,
          storename,
          note,
          description,
          order_stock,
        });

        newStock
          .save()
          .then((stock) => {
            console.log(stock);
            return res.status(201).json({
              success: true,
              msg: "Invoice has been added",
            });
          })
          .catch((err) => {
            return res.status(404).json({
              success: false,
              msg: err,
            });
          });
      } else {
        return res.status(404).json({
          msg: "User Not Found",
          success: false,
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({
        msg: err,
        success: false,
      });
    });
});

router.get("/get_invoices", (req, res) => {
  Invoice.find()
    .then((invoices) => {
      return res.status(201).json({
        invoices: invoices,
        success: true,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        msg: err,
        success: false,
      });
    });
});

router.get("/get_idv_invoices", (req, res) => {
  console.log(req.query);
  Invoice.find({
    customer_id: req.query.id,
  })
    .then((invoices) => {
      return res.status(202).json({
        user_invoices: invoices,
        success: true,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        success: false,
        msg: err,
      });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const item = req.body;
  Invoice.findByIdAndUpdate(id, { $push: { order_stock: item } })
    .then((invoice) => {
      if (invoice) {
        return res.status(201).json({
          msg: "Update Successful",
          success: true,
        });
      } else {
        return res.status(404).json({
          msg: "invoice not found",
          success: false,
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({
        msg: err,
        success: false,
      });
    });
});

router.put("/confirm_invoice/:id", (req, res) => {
  const { id } = req.params;
  Invoice.findByIdAndUpdate(id, { status: "confirmed" })
    .then((invoice) => {
      if (invoice) {
        return res.status(201).json({
          msg: `Invoice ${invoice.id} order confirmed`,
          success: true,
        });
      } else {
        return res.status(404).json({
          msg: "Invoice not found!!",
          success: false,
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({
        msg: err,
        success: false,
      });
    });
});

router.post("/delete_all_invoices", (req, res) => {
  Invoice.deleteMany().then(() => {
    return res.status(400).json({
      msg: "Deleted all invoices",
      status: "success",
    });
  });
});

router.get("/storeinfo", (req, res) => {
  User.findOne({
    id: req.body.customer_id,
  })
    .then((userid) => {
      return res.status(201).json({
        success: true,
        user: userid,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        success: false,
        msg: "Something went wrong",
      });
    });
});

module.exports = router;
