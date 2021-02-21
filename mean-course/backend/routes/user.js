const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { request } = require("node:http");

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

router.post("/login", (request, response, next) => {
  User.findOne({
    email: request.body.email,
  }).then((user) => {
    if (!user) {
      return response.status(401).json({
        message: "Email not found",
      });
    }
    return bcrypt
      .compare(request.body.password, user.password)
      .then((result) => {
        if (!result) {
          return response.status(401).json({
            message: "Email not found",
          });
      })
      .catch((exception) => {
        return response.status(401).json({
          message: "Error in Password comparison",
        });
      });
  });
});

module.exports = router;
