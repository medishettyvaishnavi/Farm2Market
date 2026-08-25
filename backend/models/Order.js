const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    transportCost: {
      type: Number,
      default: 0,
    },
    estimatedNetEarnings: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "NEGOTIATION_ACCEPTED",
        "ORDER_CREATED",
        "CONFIRMED",
        "PICKUP_SCHEDULED",
        "PICKED_UP",
        "IN_TRANSIT",
        "DELIVERED",
        "PAYMENT_PENDING",
        "PAID",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "ORDER_CREATED",
    },
    paymentStatus: {
      type: String,
      enum: [
        "PAYMENT_PENDING",
        "PAYMENT_PROCESSING",
        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED",
        "REFUNDED",
      ],
      default: "PAYMENT_PENDING",
    },
    paymentMode: {
      type: String,
      default: "Direct Bank Transfer",
    },
    transactionId: {
      type: String,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    deliveryLocation: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      default: 0,
    },
    estimatedTravelTime: {
      type: String,
      default: "",
    },
    pickupDate: {
      type: String,
      default: "",
    },
    expectedDeliveryDate: {
      type: String,
      default: "",
    },
    village: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
