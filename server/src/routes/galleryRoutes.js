const express = require("express");
const router = express.Router();
const {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// Set up multi-file fields upload config
const uploadFields = upload.fields([
  { name: "file", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "beforeImage", maxCount: 1 },
  { name: "afterImage", maxCount: 1 },
]);

router.route("/")
  .get(getGalleryItems)
  .post(protect, uploadFields, createGalleryItem);

router.route("/:id")
  .put(protect, uploadFields, updateGalleryItem)
  .delete(protect, deleteGalleryItem);

module.exports = router;
