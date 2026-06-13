const ApiError = require("../utils/apiError");
const Notice = require("../models/Notice");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  res.json({
    user: req.user,
    preferences: req.user.preferences
  });
});

const updatePreferences = asyncHandler(async (req, res) => {
  const { emailReminders, categories } = req.body;
  const user = await User.findById(req.user._id);

  if (emailReminders !== undefined) user.preferences.emailReminders = emailReminders;
  if (categories !== undefined) user.preferences.categories = categories;

  await user.save();
  res.json({ preferences: user.preferences });
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) throw new ApiError(404, "Notice not found");

  const user = await User.findById(req.user._id);
  const noticeId = notice._id.toString();
  const exists = user.bookmarks.some((id) => id.toString() === noticeId);

  user.bookmarks = exists
    ? user.bookmarks.filter((id) => id.toString() !== noticeId)
    : [...user.bookmarks, notice._id];

  await user.save();
  await user.populate("bookmarks");
  res.json({ bookmarks: user.bookmarks });
});

const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("bookmarks");
  res.json({ bookmarks: user.bookmarks });
});

module.exports = { getProfile, updatePreferences, toggleBookmark, getBookmarks };
