"use strict";

const { AbortMultipartUploadOutputFilterSensitiveLog } = require("@aws-sdk/client-s3");
const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related function for bookings */

class Booking {

  /** Create a new booking with {startDate, endDate, propertyId, guestUsername}
   *
   * returns booking {id, startDate, endDate, property, guestUsername}
   * with property as {id, title, address, description, price, ownerUsername}
   */
  static async create({ startDate, endDate, propertyId, guestUsername }) {
    // const validateBooking = await db.query(`
    //   SELECT property_id
    //     FROM bookings
    //     WHERE property_id = $3
    //           AND ($1 >= start_date AND $1 <= end_date)
    //           OR ($2 <= end_date AND $2 >= start_date)`,
    //   [startDate, endDate, propertyId]);

    // if (validateBooking.length) {
    //   throw new BadRequestError(`Sorry, this property is already
    //                             booked for those dates`);
    // }

    const bookingRes = await db.query(`
      INSERT INTO bookings (start_date, end_date, property_id, guest_username)
          VALUES ($1, $2, $3, $4)
          RETURNING id,
                    start_date AS "startDate",
                    end_date AS "endDate",
                    guest_username AS "guestUsername"`,
      [startDate, endDate, propertyId, guestUsername]);

    const booking = bookingRes.rows[0];

    const propertyRes = await db.query(
      `SELECT id,
              title,
              address,
              description,
              price,
              owner_username AS "ownerUsername"
            FROM properties
            WHERE id = $1`,
      [propertyId]);

    booking.property = propertyRes.rows[0];

    return booking;
  }
}

module.exports = Booking;