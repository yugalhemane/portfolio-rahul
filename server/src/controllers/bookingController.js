const Booking = require("../models/Booking");

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin only)
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching bookings" });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  const { name, email, phone, service, date, time, notes } = req.body;

  if (!name || !email || !service || !date || !time) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  try {
    const booking = new Booking({
      name,
      email,
      phone,
      service,
      date,
      time,
      notes,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Booking creation error:", error.message);
    res.status(500).json({ message: "Server error creating booking slot" });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin only)
const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  if (!status || !["Pending", "Confirmed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Server error updating booking status" });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin only)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting booking" });
  }
};

module.exports = {
  getBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
