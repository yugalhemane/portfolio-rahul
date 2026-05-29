const express = require("express");
const router = express.Router();
const {
  getSectionImages,
  upsertSectionImage,
} = require("../controllers/sectionImageController");
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

router.route("/")
  .get(getSectionImages)
  .post(protect, upload.single("image"), upsertSectionImage);

module.exports = router;
