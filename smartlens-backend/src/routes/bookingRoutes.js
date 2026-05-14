const express = require("express");
const { protect, requireStudio } = require("../middleware/authMiddleware");
const {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getCustomerBookings,
  getCustomerNotifications,
} = require("../controllers/bookingController");

const router = express.Router();


router.post("/public/:studioId", createBooking);
router.get("/public/customer", getCustomerBookings);
router.get("/public/notifications", getCustomerNotifications);


router.get("/", protect, requireStudio, getMyBookings);
router.put("/:id/status", protect, requireStudio, updateBookingStatus);

module.exports = router;
