const express = require("express");
const Post = require("../models/post");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
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
  const pageSize = +request.query.pageSize;
  const currentPage = +request.query.currentPage;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  const result = [];
  let fetchedDocuments;
  postQuery
    .then((documents) => {
      fetchedDocuments = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      fetchedDocuments.forEach(function (doc, index) {
        result.push({
          id: doc._id,
          title: doc.title,
          content: doc.content,
          imagePath: doc.imagePath,
        });
      });

      response.status(200).json({
        message: "Posts fetched successfully",
        posts: result,
        postCount: count,
      });
    });
});

router.get("/:id", (request, response, next) => {
  Post.findById(request.params.id).then((post) => {
    if (post) {
      response.status(200).json({
        posts: [
          {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          },
        ],
      });
    } else {
      response.status(404).json({
        message: "Post not found",
      });
    }
  });
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (request, response, next) => {
    const url = request.protocol + "://" + request.get("host");
    const post = new Post({
      title: request.body.title,
      content: request.body.content,
      imagePath: url + "/images/" + request.file.filename,
    });

    post.save().then((createdPost) => {
      console.log(createdPost);
      response.status(201).json({
        message: "Post added successfully",
        posts: [
          {
            id: createdPost._id,
            title: createdPost.title,
            content: createdPost.content,
            imagePath: createdPost.imagePath,
          },
        ],
      });
    });
  }
);

router.delete("/:id", checkAuth, (request, response, next) => {
  Post.deleteOne({ _id: request.params.id }).then((result) => {
    console.log(result);
    response.status(200).json({
      message: "Post deleted successfully",
    });
  });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (request, response, next) => {
    console.log(request.file);
    const url = request.protocol + "://" + request.get("host");
    const post = new Post({
      _id: request.body.id,
      title: request.body.title,
      content: request.body.content,
      imagePath: url + "/images/" + request.file.filename,
    });
    console.log(post);
    Post.updateOne({ _id: request.params.id }, post).then((result) => {
      console.log(result);
      response.status(200).json({
        message: "Post updated successfully",
      });
    });
  }
);

module.exports = router;
