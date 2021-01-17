const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/post");

const app = express();

mongoose
  .connect(
    "mongodb+srv://Rohith:TTUdTyqUnQ1cMAf5@cluster0.enhiv.mongodb.net/meanstack?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDb Cloud");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested,Content-Type,Accept"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );
  next();
});

app.get("/api/posts", (request, response, next) => {
  Post.find().then((documents) => {
    response.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

app.post("/api/posts", (request, response, next) => {
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
  });

  post.save().then((createdPost) => {
    console.log(createdPost);
    response.status(201).json({
      message: "Post added successfully",
      postId: createdPost.id,
    });
  });
});

app.delete("/api/posts/:id", (request, response, next) => {
  Post.deleteOne({ _id: request.params.id }).then((result) => {
    console.log(result);
    response.status(200).json({
      message: "Post deleted successfully",
    });
  });
});

module.exports = app;
