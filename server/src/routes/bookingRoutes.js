const express = require("express");
const router = express.Router();
const {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

router.route("/")
  .get(protect, getBookings)
  .post(createBooking);

router.route("/:id/status")
  .patch(protect, updateBookingStatus);

router.route("/:id")
  .delete(protect, deleteBooking);

module.exports = router;
