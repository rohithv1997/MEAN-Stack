const Post = require("../models/post");
const ObjectID = require("mongodb").ObjectID;

exports.createPost = (request, response, next) => {
  const url = request.protocol + "://" + request.get("host");
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imagePath: url + "/images/" + request.file.filename,
    userId: request.userData.userId,
  });

  post
    .save()
    .then((createdPost) => {
      console.log(createdPost);
      response.status(201).json({
        message: "Post added successfully",
        posts: [
          {
            id: createdPost._id,
            title: createdPost.title,
            content: createdPost.content,
            imagePath: createdPost.imagePath,
            userId: createdPost.userId,
          },
        ],
      });
    })
    .catch((error) => {
      console.log(error);
      response.status(500).json({
        message: "Create Post failed!",
      });
    });
};

exports.deletePost = (request, response, next) => {
  Post.deleteOne({
    _id: ObjectID(request.params.id),
    userId: ObjectID(request.userData.userId),
  })
    .then((result) => {
      if (result.n > 0) {
        response.status(200).json({
          message: "Post updated successfully",
        });
      } else {
        response.status(401).json({
          message: "Not Authorised to delete post!",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).json({
        message: "Delete Posts failed",
      });
    });
};

exports.getAllPosts = (request, response, next) => {
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
          userId: doc.userId,
        });
      });

      response.status(200).json({
        message: "Posts fetched successfully",
        posts: result,
        postCount: count,
      });
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).json({
        message: "Fetch Posts failed",
      });
    });
};

exports.getSinglePost = (request, response, next) => {
  Post.findById(request.params.id)
    .then((post) => {
      if (post) {
        response.status(200).json({
          posts: [
            {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              userId: post.userId,
            },
          ],
        });
      } else {
        response.status(404).json({
          message: "Post not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).json({
        message: "Fetch Post failed",
      });
    });
};

exports.updatePost = (request, response, next) => {
  const url = request.protocol + "://" + request.get("host");
  const post = new Post({
    _id: request.body.id,
    title: request.body.title,
    content: request.body.content,
    imagePath: url + "/images/" + request.file.filename,
    userId: request.userData.userId,
  });
  Post.updateOne(
    {
      _id: ObjectID(request.params.id),
      userId: ObjectID(request.userData.userId),
    },
    post
  )
    .then((result) => {
      if (result.nModified > 0) {
        response.status(200).json({
          message: "Post updated successfully",
        });
      } else {
        response.status(401).json({
          message: "Not Authorised to edit post!",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return response.status(500).json({
        message: "Update Post failed!",
      });
    });
};
