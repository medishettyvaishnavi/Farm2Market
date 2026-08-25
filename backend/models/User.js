const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    mobile: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    passwordHash: { 
      type: String, 
      required: true 
    },
    role: {
      type: String,
      enum: ["FARMER", "BUYER", "NGO"],
      required: true,
    },
    location: { 
      type: String, 
      trim: true 
    },
    landSize: { 
      type: Number 
    },
    soilType: { 
      type: String, 
      trim: true 
    },
    irrigationSource: { 
      type: String, 
      trim: true 
    },
    preferredLanguage: { 
      type: String, 
      default: "en" 
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("User", userSchema);