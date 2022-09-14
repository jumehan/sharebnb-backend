"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { ensureLoggedIn } = require("../middleware/authMiddleware")
const { BadRequestError } = require("../expressError");
const Property = require("../models/propertyModel");

const propertyNewSchema = require("../schemas/propertyNew.json");
const propertySearchSchema = require("../schemas/propertySearch.json");

const router = new express.Router();


/** POST / { property } =>  { property }
 *
 * property should be { title, address, description ,price }
 *
 * return {id, title, address, description ,price, owner_username }
 *
 * Authorization required: logged in user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    propertyNewSchema,
    {required: true}
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const property = await Property.create(req.body);
  return res.status(201).json({ property });
});

/** GET /  =>
 *   { properties: [
 *     {id, title, address, description ,price, owner_username }, ...] }
 *
 * Can filter on provided search filters:
 * - minPrice
 * - maxPrice
 * - description (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  // arrive as strings from querystring, but we want as ints
  if (q.minPrice !== undefined) q.minPrice = +q.minPrice;
  if (q.maxPrice !== undefined) q.maxPrice = +q.maxPrice;

  const validator = jsonschema.validate(
    q,
    propertySearchSchema,
    {required: true}
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const properties = await Property.findAll(q);
  return res.json({ properties });
});

/** GET /[id]  =>  { property }
 *
 *  Property: { id, title, address, description ,price, owner_username, images }
 *  where images is [{key, property_id}, ...]
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  const property = await Property.get(req.params.handle);
  return res.json({ property });
});


module.exports = router;
