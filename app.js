"use strict";
const { uploadImg, getS3Img } = require('./s3');

const express = require('express');
const cors = require("cors");

const app = express();
app.use(cors());


app.post('/upload', uploadImg.array('photos', 3), function (req, res, next) {

  const images = await Image.create([filesnames]);
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