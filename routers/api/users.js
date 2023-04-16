const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../model/User");
const key = require("../../config/keys").secret;

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
router.post("/register", async (req, res) => {
  let storename = req.body.storename;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let address = req.body.address;
  let city = req.body.city;
  let country = req.body.country;
  let postalcode = req.body.postalcode;
  let role = req.body.role;
  // Check for the unique Username
  const existingUsername = await User.findOne({
    username: username,
  });
  if (existingUsername) {
    return res.status(400).json({
      msg: "Username is already taken.",
      success: false,
    });
  }
  // Check for the Unique Email
  const existingEmail = await User.findOne({
    email: email,
  });
  if (existingEmail) {
    return res.status(400).json({
      msg: "Email is already registred. Did you forgot your password.",
      success: false,
    });
  }
  // The data is valid and new we can register the user
  let newUser = new User({
    storename,
    username,
    password,
    email,
    address,
    city,
    country,
    postalcode,
    role,
  });
  // Hash the password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save().then((user) => {
        return res.status(201).json({
          success: true,
          msg: "Hurry! User is now registered.",
        });
      });
    });
  });
});

/**
 * @router POST api/users/signup
 * @desc Signing the User
 * @access Public
 */
router.post("/login", (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      return res.status(404).json({
        msg: "Username is not found!!!",
        success: false,
      });
    }
    // If there is a user then compare the password
    bcrypt.compare(req.body.password, user.password).then(function (isMatch) {
      if (isMatch) {
        // User password is correct athen send the JSON token to that user
        const payload = {
          _id: user._id,
          username: user.username,
          storename: user.storename,
          email: user.email,
        };

        jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) => {
          return res.status(200).json({
            success: true,
            user: user,
            token: `Bearer ${token}`,
            msg: "You are now logged in",
          });
        });
      } else {
        return res.status(404).json({
          msg: "Incorrect password!!!",
          success: false,
        });
        re;
      }
    });
  });
});

/**
 * @router Get api/users/profile
 * @desc Return the user's data
 * @access Private
 */
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      user: req.user,
    });
  }
);

/**
 * @router Get api/users/get_user
 * @desc Return the users
 * @access Private/Admin
 */
router.get(
  "/get_users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role == "admin") {
      User.find()
        .then((users) => {
          return res.status(200).json({
            users: users,
            success: true,
          });
        })
        .catch((err) => {
          return res.status(400).json({
            success: false,
            msg: err,
          });
        });
    }
  }
);

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { storename, address, city, country, postalcode } = req.body;

  // Update the user info in the database
  User.findByIdAndUpdate(id, { storename, address, city, country, postalcode })
    .then((updatedUser) =>
      res.status(200).json({
        user: updatedUser,
        msg: `User ${storename}'s profile has been updated`,
      })
    )
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post("/delete_all_user", (req, res) => {
  User.deleteMany().then(() => {
    return res.status(400).json({
      msg: "Deleted all users",
      status: "success",
    });
  });
});

module.exports = router;
