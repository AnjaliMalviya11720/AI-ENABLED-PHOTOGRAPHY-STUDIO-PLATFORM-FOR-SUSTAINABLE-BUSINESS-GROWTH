const Booking = require("../models/Booking");


exports.createBooking = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      date,
      eventTime,
      location,
      eventType,
      budget,
    } = req.body;
    const studioId = req.params.studioId;

    const booking = await Booking.create({
      studio: studioId,
      clientName,
      clientEmail,
      clientPhone,
      date,
      eventTime,
      location,
      eventType,
      budget,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ studio: req.studio._id }).sort({ date: 1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, studio: req.studio._id },
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: customer booking history by email (simple customer mode)
exports.getCustomerBookings = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Customer email is required" });
    }

    const bookings = await Booking.find({ clientEmail: email })
      .populate("studio", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Public: simple notification feed by email
exports.getCustomerNotifications = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Customer email is required" });
    }

    const bookings = await Booking.find({ clientEmail: email })
      .sort({ updatedAt: -1 })
      .limit(20);

    const data = bookings.map((booking) => ({
      id: booking._id,
      status: booking.status,
      message:
        booking.status === "confirmed"
          ? "Your booking was accepted by photographer."
          : booking.status === "cancelled"
          ? "Your booking was rejected by photographer."
          : "Your booking request is pending review.",
      updatedAt: booking.updatedAt,
      eventType: booking.eventType,
      date: booking.date,
      eventTime: booking.eventTime,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
