const express = require("express");
const router = express.Router();
const {
  submitInquiry,
  getInquiries,
  deleteInquiry,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/academyController");
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// Inquiries Endpoints
router.route("/inquiries")
  .get(protect, getInquiries)
  .post(submitInquiry);

router.route("/inquiries/:id")
  .delete(protect, deleteInquiry);

// Courses Endpoints
router.route("/courses")
  .get(getCourses)
  .post(protect, upload.single("image"), createCourse);

router.route("/courses/:id")
  .put(protect, upload.single("image"), updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
