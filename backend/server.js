const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const cropRoutes = require("./features/crops/crop.routes");
const offerRoutes = require("./features/offers/offer.routes");
const orderRoutes = require("./features/orders/order.routes");
const ngoRoutes = require("./features/ngo/ngo.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ngo", ngoRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Farm2Market API is running",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Farm2Market backend is running",
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/farm2market";

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});