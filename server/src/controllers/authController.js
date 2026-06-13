const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/token");

function authResponse(user) {
  return {
    token: signToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role = "Student" } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password, role });
  res.status(201).json(authResponse(user));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });
  res.json(authResponse(user));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    user.passwordResetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
  }

  res.json({ message: "If the email exists, a reset link will be sent" });
});

module.exports = { signup, login, forgotPassword };
