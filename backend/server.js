const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./features/auth/auth.routes");
const intelligenceRoutes = require("./features/intelligence/intelligence.routes");
const cropRoutes = require("./features/crops/crop.routes");
const offerRoutes = require("./features/offers/offer.routes");
const orderRoutes = require("./features/orders/order.routes");
const ngoRoutes = require("./features/ngo/ngo.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ngo", ngoRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Farm2Market API is running",
  });
});

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});