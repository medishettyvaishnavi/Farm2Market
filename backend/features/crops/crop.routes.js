const express = require("express");
const { authenticate, authorizeRoles } = require("../../middleware/auth");
const {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
} = require("./crop.controller");

const router = express.Router();

router.get("/", authenticate, getCrops);
router.get("/:id", authenticate, getCropById);
router.post("/", authenticate, authorizeRoles("FARMER"), createCrop);
router.put("/:id", authenticate, authorizeRoles("FARMER"), updateCrop);
router.delete("/:id", authenticate, authorizeRoles("FARMER"), deleteCrop);

module.exports = router;
