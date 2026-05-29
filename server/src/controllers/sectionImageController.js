const SectionImage = require("../models/SectionImage");
const { uploadFile } = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// @desc    Get all custom section images
// @route   GET /api/section-images
// @access  Public
const getSectionImages = async (req, res) => {
  try {
    const images = await SectionImage.find({});
    res.json(images);
  } catch (error) {
    console.error("Fetch Section Images Error:", error.message);
    res.status(500).json({ message: "Server error fetching section images" });
  }
};

// @desc    Upsert/Upload a section image
// @route   POST /api/section-images
// @access  Private (Admin only)
const upsertSectionImage = async (req, res) => {
  const { key, pageName, sectionName } = req.body;

  if (!key || !pageName || !sectionName) {
    return res.status(400).json({ message: "Key, pageName, and sectionName are required" });
  }

  try {
    let imageUrl = req.body.imageUrl; // Option to send a URL directly (though we will use file upload)

    if (req.file) {
      // Find existing to clean up local file if any
      const existing = await SectionImage.findOne({ key });
      if (existing && existing.imageUrl && existing.imageUrl.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "../..", existing.imageUrl);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (err) {
            console.error("Failed to delete old local file:", oldPath, err.message);
          }
        }
      }

      imageUrl = await uploadFile(req.file, "section-images");
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "No image file uploaded or URL provided" });
    }

    const sectionImage = await SectionImage.findOneAndUpdate(
      { key },
      {
        imageUrl,
        pageName,
        sectionName,
      },
      { upsert: true, new: true }
    );

    res.status(200).json(sectionImage);
  } catch (error) {
    console.error("Upsert Section Image Error:", error.message);
    res.status(500).json({ message: "Server error updating section image" });
  }
};

module.exports = {
  getSectionImages,
  upsertSectionImage,
};
