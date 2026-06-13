const express = require("express");
const {
  getBookmarks,
  getProfile,
  toggleBookmark,
  updatePreferences
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile/preferences", protect, updatePreferences);
router.get("/bookmarks", protect, getBookmarks);
router.post("/bookmarks/:id", protect, toggleBookmark);

module.exports = router;
