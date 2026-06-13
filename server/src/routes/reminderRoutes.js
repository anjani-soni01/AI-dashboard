const express = require("express");
const {
  getUserReminders,
  updateReminderPreferences
} = require("../controllers/reminderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/user", protect, getUserReminders);
router.put("/user", protect, updateReminderPreferences);

module.exports = router;
