"use strict";

/** Express App for ShareBnB */
const { uploadImg, getS3Img } = require('./s3');
const { NotFoundError } = require("./expressError");

const express = require('express');
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { authenticateJWT } = require("./middleware/authMiddleware");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authenticateJWT);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/messages", messageRoutes);

app.post('/upload', uploadImg.array('photos', 3), function (req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!');
});

app.get('/images/:key', async function (req, res) {
  const data = await getS3Img();
  res.send('Yay');
});


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;