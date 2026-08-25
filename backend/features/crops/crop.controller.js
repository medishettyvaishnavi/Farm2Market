const cropService = require("./crop.service");

const createCrop = async (req, res) => {
  try {
    const crop = await cropService.createCrop(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Crop listed successfully",
      crop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCrops = async (req, res) => {
  try {
    const filter = {};
    if (req.query.owner) {
      filter.owner = req.query.owner;
    } else if (req.query.farmerOnly === "true") {
      filter.owner = req.user.id;
    } else {
      filter.status = "active"; // Buyers see active listings only
    }
    const crops = await cropService.getCrops(filter);
    res.status(200).json({
      success: true,
      crops,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCropById = async (req, res) => {
  try {
    const crop = await cropService.getCropById(req.params.id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }
    res.status(200).json({
      success: true,
      crop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCrop = async (req, res) => {
  try {
    const crop = await cropService.updateCrop(req.params.id, req.body, req.user.id);
    res.status(200).json({
      success: true,
      message: "Crop listing updated successfully",
      crop,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCrop = async (req, res) => {
  try {
    await cropService.deleteCrop(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Crop listing deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
};
