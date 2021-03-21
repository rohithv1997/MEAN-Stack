const express = require("express");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const path = require("path");
const { CONSOLE_APPENDER } = require("karma/lib/constants");

const app = express();

const connectionString =
  process.env.MONGO_ATLAS_SERVER_NAME +
  "//" +
  process.env.MONGO_ATLAS_LOGIN +
  ":" +
  process.env.MONGO_ATLAS_PASSWORD +
  "@" +
  process.env.MONGO_ATLAS_CLUSTER +
  "/" +
  process.env.MONGO_ATLAS_PROJECT +
  "?" +
  process.env.MONGO_ATLAS_ARGS;

console.log(connectionString);

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDb Cloud");
  })
  .catch((error) => {
    console.log(error);
    console.log("Connection failed");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested,Content-Type,Accept,authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
