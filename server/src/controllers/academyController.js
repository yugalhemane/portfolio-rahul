const Inquiry = require("../models/Inquiry");
const Course = require("../models/Course");
const { uploadFile } = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// ==================== INQUIRIES CONTROLLERS ====================

// @desc    Submit academy inquiry
// @route   POST /api/academy/inquiries
// @access  Public
const submitInquiry = async (req, res) => {
  const { name, email, course, message } = req.body;

  if (!name || !email || !course) {
    return res.status(400).json({ message: "Please fill in all required fields" });
  }

  try {
    const inquiry = new Inquiry({
      name,
      email,
      course,
      message,
    });

    const savedInquiry = await inquiry.save();
    res.status(201).json(savedInquiry);
  } catch (error) {
    res.status(500).json({ message: "Server error submitting academy inquiry" });
  }
};

// @desc    Get all academy inquiries
// @route   GET /api/academy/inquiries
// @access  Private (Admin only)
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching inquiries" });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/academy/inquiries/:id
// @access  Private (Admin only)
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    await inquiry.deleteOne();
    res.json({ message: "Inquiry removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting inquiry" });
  }
};

// ==================== COURSES CONTROLLERS ====================

// @desc    Get all courses
// @route   GET /api/academy/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error("Fetch Courses Error:", error.message);
    res.status(500).json({ message: "Server error fetching training courses" });
  }
};

// @desc    Create a new course
// @route   POST /api/academy/courses
// @access  Private (Admin only)
const createCourse = async (req, res) => {
  const { title, description, duration, price, level, syllabus } = req.body;

  if (!title || !description || !duration || !price) {
    return res.status(400).json({ message: "Title, description, duration, and price are required" });
  }

  try {
    let parsedSyllabus = [];
    if (syllabus) {
      if (Array.isArray(syllabus)) {
        parsedSyllabus = syllabus;
      } else if (typeof syllabus === "string") {
        try {
          parsedSyllabus = JSON.parse(syllabus);
        } catch (e) {
          parsedSyllabus = syllabus.split(",").map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    let image = "";
    if (req.file) {
      image = await uploadFile(req.file, "academy");
    }

    const course = new Course({
      title,
      description,
      duration,
      price,
      level: level || "Advanced",
      syllabus: parsedSyllabus,
      image,
    });

    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: "Server error creating training course", error: error.message });
  }
};

// @desc    Update course details
// @route   PUT /api/academy/courses/:id
// @access  Private (Admin only)
const updateCourse = async (req, res) => {
  const { title, description, duration, price, level, syllabus } = req.body;

  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.duration = duration || course.duration;
    course.price = price || course.price;
    course.level = level || course.level;

    if (syllabus !== undefined) {
      let parsedSyllabus = [];
      if (Array.isArray(syllabus)) {
        parsedSyllabus = syllabus;
      } else if (typeof syllabus === "string") {
        try {
          parsedSyllabus = JSON.parse(syllabus);
        } catch (e) {
          parsedSyllabus = syllabus.split(",").map((s) => s.trim()).filter(Boolean);
        }
      }
      course.syllabus = parsedSyllabus;
    }

    if (req.file) {
      // Remove old local image if applicable
      if (course.image && course.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "../..", course.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      course.image = await uploadFile(req.file, "academy");
    }

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    console.error("Update Course Error:", error.message);
    res.status(500).json({ message: "Server error updating training course" });
  }
};

// @desc    Delete training course
// @route   DELETE /api/academy/courses/:id
// @access  Private (Admin only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Clean up local image if applicable
    if (course.image && course.image.startsWith("/uploads/")) {
      const localPath = path.join(__dirname, "../..", course.image);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    await course.deleteOne();
    res.json({ message: "Course removed successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error.message);
    res.status(500).json({ message: "Server error deleting training course" });
  }
};

module.exports = {
  submitInquiry,
  getInquiries,
  deleteInquiry,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
