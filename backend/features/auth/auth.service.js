const bcrypt = require("bcryptjs");
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

module.exports = {
  registerUser,
};