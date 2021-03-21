const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const PostController = require("../controllers/post");
const extractFile = require("../middleware/file");

router.get("", PostController.getAllPosts);

router.get("/:id", PostController.getSinglePost);

router.post("", checkAuth, extractFile, PostController.createPost);

router.delete("/:id", checkAuth, PostController.deletePost);

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

module.exports = router;
