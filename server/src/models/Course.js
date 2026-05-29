const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Course duration description is required"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Course price is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Masterclass"],
      default: "Advanced",
    },
    syllabus: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
