const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const User = require("../models/User");
const { env } = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Authentication token missing");
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
});

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "Admin") {
    return next(new ApiError(403, "Admin access required"));
  }
  return next();
}

module.exports = { protect, adminOnly };
