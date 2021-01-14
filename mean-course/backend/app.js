const express = require("express");

const app = express();

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

app.post("/api/posts", (request, response, next) => {
  const post = request.body;
  console.log(post);
  response.status(201).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (request, response, next) => {
  const posts = [
    {
      id: "fafdweswewe232121",
      title: "First ServerSide post",
      content: "This is coming from the server",
    },
    {
      id: "eiurewjeiwjewinew231231",
      title: "Second ServerSide post",
      content: "This is coming from the server too!",
    },
  ];
  response.status(200).json({
    message: "Posts fetched successfully",
    posts: posts,
  });
});

module.exports = app;
