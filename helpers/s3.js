"use strict";

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const {
  BUCKET_NAME,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  REGION,
} = require('../config');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3Client = new S3Client({
  region: REGION,
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
});

/** multer upload function */
const uploadImg = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.filename });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});


// const getS3Img = async () => {
//   const bucketParams = {
//     Bucket: BUCKET_NAME,
//     Key: "",
//   };
//   try {
//     // Create a helper function to convert a ReadableStream to a string.
//     const streamToString = (stream) =>
//       new Promise((resolve, reject) => {
//         const chunks = [];
//         stream.on("data", (chunk) => chunks.push(chunk));
//         stream.on("error", reject);
//         stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
//       });
//     // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
//     const data = await s3Client.send(new GetObjectCommand(bucketParams));
//     console.log(data);
//     return data; // For unit tests.
//     // Convert the ReadableStream to a string.
//     // const bodyContents = await streamToString(data.Body);
//     // console.log(bodyContents);
//     //   return bodyContents;
//   } catch (err) {
//     console.log("Error", err);
//   }
// };

/** Construct a object URL from s3 bucket parameters
 * returns a url string
 *
 * @example https://r27-sharebnb.s3.amazonaws.com/1663108593387
*/

function getUrlFromBucket(key) {
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
};

module.exports = {
  uploadImg,
  getUrlFromBucket,
};