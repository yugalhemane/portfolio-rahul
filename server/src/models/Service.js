const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Price starting rate is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "Haircuts",
      trim: true,
    },
    icon: {
      type: String,
      default: "scissors",
      trim: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
