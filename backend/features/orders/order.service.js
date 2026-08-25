const Order = require("../../models/Order");
const Crop = require("../../models/Crop");

const allowedTransitions = {
  ORDER_CREATED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PICKUP_SCHEDULED", "CANCELLED"],
  PICKUP_SCHEDULED: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["IN_TRANSIT"],
  IN_TRANSIT: ["DELIVERED"],
  DELIVERED: ["PAYMENT_PENDING"],
  PAYMENT_PENDING: ["PAID"],
  PAID: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const getOrdersForFarmer = async (farmerId) => {
  return await Order.find({ farmer: farmerId }).populate("crop").sort({ createdAt: -1 });
};

const getOrdersForBuyer = async (buyerId) => {
  return await Order.find({ buyer: buyerId }).populate("crop").sort({ createdAt: -1 });
};

const getOrderById = async (id, userId, role) => {
  const order = await Order.findById(id).populate("crop").populate("farmer", "name phone location").populate("buyer", "name phone location");
  if (!order) {
    throw new Error("Order not found");
  }

  // Security: only allow farmer, buyer, or NGO to see this order
  if (
    role !== "NGO" &&
    order.farmer._id.toString() !== userId.toString() &&
    order.buyer._id.toString() !== userId.toString()
  ) {
    throw new Error("Unauthorized access to this order");
  }

  return order;
};

const updateOrderStatus = async (id, nextStatus, userId, role) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new Error("Order not found");
  }

  // Validate ownership
  if (role === "FARMER" && order.farmer.toString() !== userId.toString()) {
    throw new Error("Unauthorized to update this order");
  }
  if (role === "BUYER" && order.buyer.toString() !== userId.toString()) {
    throw new Error("Unauthorized to update this order");
  }

  const currentStatus = order.orderStatus;
  const validNext = allowedTransitions[currentStatus] || [];

  if (!validNext.includes(nextStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${nextStatus}`);
  }

  // Enforce role actions
  if (role === "BUYER" && nextStatus !== "CANCELLED") {
    throw new Error("Buyers can only cancel orders");
  }
  if (role === "FARMER" && nextStatus === "PAID") {
    throw new Error("Status PAID must be triggered through payment gateway execution");
  }

  order.orderStatus = nextStatus;

  // Auto set delivery status field map for logistics compatibility if needed
  if (nextStatus === "DELIVERED") {
    order.paymentStatus = "PAYMENT_PENDING"; // Prompt payment
  }

  return await order.save();
};

const executePayment = async (id, paymentMode, buyerId) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.buyer.toString() !== buyerId.toString()) {
    throw new Error("Unauthorized. Only the buyer can pay for this order");
  }

  // Allow payment if status is PAYMENT_PENDING or ORDER_CREATED or CONFIRMED
  if (!["PAYMENT_PENDING", "ORDER_CREATED", "CONFIRMED", "DELIVERED"].includes(order.orderStatus)) {
    throw new Error(`Payment not allowed at order status ${order.orderStatus}`);
  }

  // Sandbox simulation
  order.paymentStatus = "PAYMENT_SUCCESS";
  order.orderStatus = "PAID";
  order.paymentMode = paymentMode || "Direct Escrow Settlement";
  order.transactionId = "TXN_SUCCESS_" + Date.now() + "_" + Math.floor(1000 + Math.random() * 9000);

  return await order.save();
};

module.exports = {
  getOrdersForFarmer,
  getOrdersForBuyer,
  getOrderById,
  updateOrderStatus,
  executePayment,
};
