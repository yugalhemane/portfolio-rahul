const mongoose = require("mongoose");

const sectionImageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Key is required"],
      unique: true,
      index: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    pageName: {
      type: String,
      required: [true, "Page name is required"],
      trim: true,
    },
    sectionName: {
      type: String,
      required: [true, "Section name is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SectionImage", sectionImageSchema);
