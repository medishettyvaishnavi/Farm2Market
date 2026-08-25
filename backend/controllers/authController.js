const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =========================
// SIGNUP
// =========================
const signup = async (req, res) => {
  try {
    const {
      name,
      mobile,
      password,
      role,
      location,
      landSize,
      soilType,
      irrigationSource,
      preferredLanguage,
    } = req.body;

    // Required fields
    if (!name || !mobile || !password || !role) {
      return res.status(400).json({
        message: "Name, mobile, password and role are required",
      });
    }

    // Only Farmer/Buyer can register
    if (!["FARMER", "BUYER"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Basic mobile validation
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits",
      });
    }

    // Check existing mobile
    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(409).json({
        message: "Mobile number already registered",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      mobile,
      passwordHash,
      role,
      location,
      landSize,
      soilType,
      irrigationSource,
      preferredLanguage,
    });

    // Create JWT immediately after registration
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        location: user.location,
        landSize: user.landSize,
        soilType: user.soilType,
        irrigationSource: user.irrigationSource,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Signup failed",
    });
  }
};

// =========================
// LOGIN
// =========================
const login = async (req, res) => {
  try {
    const { mobile, password, role } = req.body;

    // Required fields
    if (!mobile || !password || !role) {
      return res.status(400).json({
        message: "Mobile, password and role are required",
      });
    }

    // Validate role
    if (!["FARMER", "BUYER"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Validate mobile
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits",
      });
    }

    // Find user
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(401).json({
        message: "Invalid mobile number or password",
      });
    }

    // Check role
    if (user.role !== role) {
      return res.status(401).json({
        message: "Invalid role for this account",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid mobile number or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        location: user.location,
        landSize: user.landSize,
        soilType: user.soilType,
        irrigationSource: user.irrigationSource,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

module.exports = {
  signup,
  login,
};