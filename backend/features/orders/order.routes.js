const express = require("express");
const { authenticate } = require("../../middleware/auth");
const {
  getFarmerOrders,
  getBuyerOrders,
  getOrderById,
  updateOrderStatus,
  payOrder,
} = require("./order.controller");

const router = express.Router();

router.get("/farmer", authenticate, getFarmerOrders);
router.get("/buyer", authenticate, getBuyerOrders);
router.get("/:id", authenticate, getOrderById);
router.patch("/:id/status", authenticate, updateOrderStatus);
router.post("/:id/pay", authenticate, payOrder);

module.exports = router;
