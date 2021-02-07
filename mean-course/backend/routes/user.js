const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (request, response, next) => {
  bcrypt.hash(request.body.password, 10).then((hash) => {
    const user = new User({
      email: request.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        response.status(201).json({
          message: "User created successfully",
          user: result,
        });
      })
      .catch((error) => {
        response.status(500).json({
          error: error,
        });
      });
  });
});

module.exports = router;
