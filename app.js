"use strict";
const { uploadImg, getS3Img } = require('./s3');

const express = require('express');

const app = express();


app.post('/upload', uploadImg.array('photos', 3), function(req, res, next) {
  res.send('Successfully uploaded ' + req.files.length + ' files!')
})

app.get('/images/:key', async function(req, res) {
  const data = await getS3Img()
  res.send('Yay')
})

module.exports = app;