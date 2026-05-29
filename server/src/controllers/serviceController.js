const Service = require("../models/Service");
const { uploadFile } = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    console.error("Fetch Services Error:", error.message);
    res.status(500).json({ message: "Server error fetching services" });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin only)
const createService = async (req, res) => {
  const { title, description, price, category, icon } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: "Title and price are required" });
  }

  try {
    let image = "";
    if (req.file) {
      image = await uploadFile(req.file, "services");
    }

    const service = new Service({
      title,
      description,
      price,
      category: category || "Haircuts",
      icon: icon || "scissors",
      image,
    });

    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    console.error("Create Service Error:", error.message);
    res.status(500).json({ message: "Server error adding service" });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin only)
const updateService = async (req, res) => {
  const { title, description, price, category, icon } = req.body;

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.title = title || service.title;
    service.description = description !== undefined ? description : service.description;
    service.price = price || service.price;
    service.category = category || service.category;
    service.icon = icon || service.icon;

    if (req.file) {
      // Clean up old local image if exists
      if (service.image && service.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "../..", service.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      service.image = await uploadFile(req.file, "services");
    }

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    console.error("Update Service Error:", error.message);
    res.status(500).json({ message: "Server error updating service" });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Admin only)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Clean up local image if applicable
    if (service.image && service.image.startsWith("/uploads/")) {
      const localPath = path.join(__dirname, "../..", service.image);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    await service.deleteOne();
    res.json({ message: "Service removed successfully" });
  } catch (error) {
    console.error("Delete Service Error:", error.message);
    res.status(500).json({ message: "Server error deleting service" });
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
