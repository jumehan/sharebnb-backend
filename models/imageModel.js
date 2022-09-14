"use strict";

const db = require("../db");



const {
  NotFoundError,
  BadRequestError,

} = require("../expressError");



/** Related functions for Images */

/** create image entry
 * takes in a { key, propertyId}
 * -returns {key, propertyId }
 */
