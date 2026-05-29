const Gallery = require("../models/Gallery");
const { uploadFile } = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Fetch Gallery Error:", error.message);
    res.status(500).json({ message: "Server error fetching gallery items" });
  }
};

// @desc    Create new gallery item (supports file uploads)
// @route   POST /api/gallery
// @access  Private (Admin only)
const createGalleryItem = async (req, res) => {
  try {
    const { title, category, description, featured, videoUrl } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required" });
    }

    let imageUrl = "";
    let finalVideoUrl = videoUrl || "";
    let beforeImageUrl = "";
    let afterImageUrl = "";

    // Upload standard file if present
    if (req.files && req.files.file && req.files.file[0]) {
      const file = req.files.file[0];
      const isVideo = file.mimetype.startsWith("video/");
      const uploadedUrl = await uploadFile(file, "gallery");
      
      if (isVideo) {
        finalVideoUrl = uploadedUrl;
      } else {
        imageUrl = uploadedUrl;
      }
    }

    // Upload thumbnail if present (specifically for reels/videos cover)
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      imageUrl = await uploadFile(req.files.thumbnail[0], "gallery/thumbnails");
    }

    // Upload before/after images if present
    if (req.files && req.files.beforeImage && req.files.beforeImage[0]) {
      beforeImageUrl = await uploadFile(req.files.beforeImage[0], "gallery/transformations");
    }
    if (req.files && req.files.afterImage && req.files.afterImage[0]) {
      afterImageUrl = await uploadFile(req.files.afterImage[0], "gallery/transformations");
    }

    const galleryItem = new Gallery({
      title,
      category,
      imageUrl,
      videoUrl: finalVideoUrl,
      beforeImageUrl,
      afterImageUrl,
      description,
      featured: featured === "true" || featured === true,
    });

    const savedItem = await galleryItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Create Gallery Error:", error);
    res.status(500).json({ message: "Server error creating gallery item", error: error.message });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private (Admin only)
const updateGalleryItem = async (req, res) => {
  try {
    const { title, category, description, featured, videoUrl } = req.body;
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    item.title = title || item.title;
    item.category = category || item.category;
    item.description = description !== undefined ? description : item.description;
    item.featured = featured !== undefined ? (featured === "true" || featured === true) : item.featured;
    
    if (videoUrl !== undefined) {
      item.videoUrl = videoUrl;
    }

    // Handle new file uploads if editing/replacing images
    if (req.files) {
      if (req.files.file && req.files.file[0]) {
        const file = req.files.file[0];
        const isVideo = file.mimetype.startsWith("video/");
        const uploadedUrl = await uploadFile(file, "gallery");
        if (isVideo) {
          item.videoUrl = uploadedUrl;
        } else {
          item.imageUrl = uploadedUrl;
        }
      }

      if (req.files.thumbnail && req.files.thumbnail[0]) {
        item.imageUrl = await uploadFile(req.files.thumbnail[0], "gallery/thumbnails");
      }

      if (req.files.beforeImage && req.files.beforeImage[0]) {
        item.beforeImageUrl = await uploadFile(req.files.beforeImage[0], "gallery/transformations");
      }
      if (req.files.afterImage && req.files.afterImage[0]) {
        item.afterImageUrl = await uploadFile(req.files.afterImage[0], "gallery/transformations");
      }
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.error("Update Gallery Error:", error.message);
    res.status(500).json({ message: "Server error updating gallery item" });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private (Admin only)
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Function to delete local files if they exist
    const deleteLocalFile = (fileUrl) => {
      if (fileUrl && fileUrl.startsWith("/uploads/")) {
        const localPath = path.join(__dirname, "../..", fileUrl);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }
    };

    // Clean up local files if fallback storage was used
    deleteLocalFile(item.imageUrl);
    deleteLocalFile(item.videoUrl);
    deleteLocalFile(item.beforeImageUrl);
    deleteLocalFile(item.afterImageUrl);

    await item.deleteOne();
    res.json({ message: "Gallery item removed successfully" });
  } catch (error) {
    console.error("Delete Gallery Error:", error.message);
    res.status(500).json({ message: "Server error deleting gallery item" });
  }
};

module.exports = {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
