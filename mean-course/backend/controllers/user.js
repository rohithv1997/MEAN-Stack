const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (request, response, next) => {
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
        console.log(error);
        response.status(500).json({
          message: "Invalid Authentication Credentials",
        });
      });
  });
};

exports.login = (request, response, next) => {
  let fetchedUser;
  User.findOne({
    email: request.body.email,
  }).then((user) => {
    if (!user) {
      return response.status(401).json({
        message: "Email not found",
      });
    }

    fetchedUser = user;
    return bcrypt
      .compare(request.body.password, user.password)
      .then((result) => {
        if (!result) {
          return response.status(401).json({
            message: "Password mismatch",
          });
        }

        const token = jwt.sign(
          {
            email: fetchedUser.email,
            userId: fetchedUser._id,
          },
          process.env.JWT_KEY,
          {
            expiresIn: process.env.JWT_TIMEOUT,
          }
        );

        return response.status(200).json({
          token: token,
          expiresIn: 900,
          userId: fetchedUser._id,
        });
      })
      .catch((error) => {
        console.log(error);
        return response.status(401).json({
          message: "Error in Password comparison",
        });
      });
  });
};
