"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "sharebnb_test"
      : process.env.DATABASE_URL || "sharebnb";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// AWS S3 setup
const REGION = process.env.REGION; //e.g. "us-east-1"
const BUCKET_NAME = process.env.BUCKET_NAME;
const ACCESS_KEY_ID= process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY= process.env.SECRET_ACCESS_KEY;

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  REGION,
  BUCKET_NAME,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
};
