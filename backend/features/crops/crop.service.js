const Crop = require("../../models/Crop");

const createCrop = async (cropData, ownerId) => {
  return await Crop.create({
    ...cropData,
    owner: ownerId,
    status: "active",
  });
};

const getCrops = async (filter = {}) => {
  return await Crop.find(filter).populate("owner", "name email phone location");
};

const getCropById = async (id) => {
  return await Crop.findById(id).populate("owner", "name email phone location");
};

const updateCrop = async (id, cropData, ownerId) => {
  const crop = await Crop.findById(id);
  if (!crop) {
    throw new Error("Crop not found");
  }

  if (crop.owner.toString() !== ownerId.toString()) {
    throw new Error("Unauthorized to update this crop");
  }

  Object.assign(crop, cropData);
  return await crop.save();
};

const deleteCrop = async (id, ownerId) => {
  const crop = await Crop.findById(id);
  if (!crop) {
    throw new Error("Crop not found");
  }

  if (crop.owner.toString() !== ownerId.toString()) {
    throw new Error("Unauthorized to delete this crop");
  }

  await Crop.findByIdAndDelete(id);
  return { success: true };
};

module.exports = {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
};
