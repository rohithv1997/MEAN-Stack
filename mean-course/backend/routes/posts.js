const express = require("express");
const Post = require("../models/post");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    callback(error, "backend/images"); // relative to server.js path
  },
  filename: (request, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + extension);
  },
});

router.get("", (request, response, next) => {
  Post.find().then((documents) => {
    response.status(200).json({
      message: "Posts fetched successfully",
      posts: documents,
    });
  });
});

router.get("/:id", (request, response, next) => {
  Post.findById(request.params.id).then((post) => {
    if (post) {
      response.status(200).json(post);
    } else {
      response.status(404).json({
        message: "Post not found",
      });
    }
  });
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (request, response, next) => {
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
  }
);

router.delete("/:id", (request, response, next) => {
  Post.deleteOne({ _id: request.params.id }).then((result) => {
    console.log(result);
    response.status(200).json({
      message: "Post deleted successfully",
    });
  });
});

router.put("/:id", (request, response, next) => {
  const post = new Post({
    _id: request.body.id,
    title: request.body.title,
    content: request.body.content,
  });

  Post.updateOne({ _id: request.params.id }, post).then((result) => {
    console.log(result);
    response.status(200).json({
      message: "Post updated successfully",
    });
  });
});

module.exports = router;
