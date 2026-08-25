const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.js");

const registerUser = async ({ name, email, password, role, phone, location }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
    location,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    location: user.location,
    isVerified: user.isVerified,
  };
};

const loginUser = async ({ email, mobile, password }) => {
  let user;
  if (mobile) {
    user = await User.findOne({ phone: mobile });
  } else if (email) {
    user = await User.findOne({ email });
  }

  if (!user) {
    throw new Error("Invalid mobile number/email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid mobile/email or password");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "farm2market_secret_key_2026",
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      location: user.location,
      isVerified: user.isVerified,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};