const Notice = require("../models/Notice");
const ReminderPreference = require("../models/ReminderPreference");
const asyncHandler = require("../utils/asyncHandler");

const getUserReminders = asyncHandler(async (req, res) => {
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);

  const notices = await Notice.find({
    deadline: { $gte: now, $lte: weekEnd }
  }).sort({ deadline: 1 });

  const reminders = notices.map((notice) => ({
    id: notice._id,
    title: notice.title,
    category: notice.category,
    deadline: notice.deadline,
    priority: notice.priority,
    daysRemaining: Math.ceil((notice.deadline - now) / (1000 * 60 * 60 * 24))
  }));

  res.json({ reminders });
});

const updateReminderPreferences = asyncHandler(async (req, res) => {
  const preference = await ReminderPreference.findOneAndUpdate(
    { user: req.user._id },
    {
      user: req.user._id,
      emailEnabled: req.body.emailEnabled,
      browserEnabled: req.body.browserEnabled,
      daysBeforeDeadline: req.body.daysBeforeDeadline
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ preferences: preference });
});

module.exports = { getUserReminders, updateReminderPreferences };
