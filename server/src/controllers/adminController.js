const ApiError = require("../utils/apiError");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["Student", "Admin"].includes(role)) {
    throw new ApiError(400, "Role must be Student or Admin");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) throw new ApiError(404, "User not found");
  res.json({ user });
});

module.exports = { getUsers, updateUserRole };
