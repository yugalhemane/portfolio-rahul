const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["cuts", "colors", "styling", "bridal", "grooming", "studio", "transformations", "reels", "instagram"],
      default: "cuts",
    },
    imageUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    beforeImageUrl: {
      type: String,
    },
    afterImageUrl: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);
