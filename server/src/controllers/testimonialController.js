const Testimonial = require("../models/Testimonial");
const { uploadFile } = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error("Fetch Testimonials Error:", error.message);
    res.status(500).json({ message: "Server error fetching testimonials" });
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (Admin only)
const createTestimonial = async (req, res) => {
  try {
    const { clientName, rating, feedback } = req.body;

    if (!clientName || !feedback) {
      return res.status(400).json({ message: "Client name and feedback are required" });
    }

    let image = "";

    // Upload client avatar if uploaded
    if (req.file) {
      image = await uploadFile(req.file, "testimonials");
    }

    const testimonial = new Testimonial({
      clientName,
      image,
      rating: rating ? parseInt(rating, 10) : 5,
      feedback,
    });

    const savedTestimonial = await testimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    console.error("Create Testimonial Error:", error.message);
    res.status(500).json({ message: "Server error creating testimonial" });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin only)
const updateTestimonial = async (req, res) => {
  try {
    const { clientName, rating, feedback } = req.body;
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    testimonial.clientName = clientName || testimonial.clientName;
    testimonial.feedback = feedback || testimonial.feedback;
    if (rating !== undefined) {
      testimonial.rating = parseInt(rating, 10);
    }

    // Handle image upload if a new file is uploaded
    if (req.file) {
      // Remove old local image if applicable
      if (testimonial.image && testimonial.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "../..", testimonial.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      testimonial.image = await uploadFile(req.file, "testimonials");
    }

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (error) {
    console.error("Update Testimonial Error:", error.message);
    res.status(500).json({ message: "Server error updating testimonial" });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin only)
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Clean up local image if applicable
    if (testimonial.image && testimonial.image.startsWith("/uploads/")) {
      const localPath = path.join(__dirname, "../..", testimonial.image);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    await testimonial.deleteOne();
    res.json({ message: "Testimonial removed successfully" });
  } catch (error) {
    console.error("Delete Testimonial Error:", error.message);
    res.status(500).json({ message: "Server error deleting testimonial" });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
