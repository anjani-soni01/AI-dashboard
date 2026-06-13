const mongoose = require("mongoose");

const reminderPreferenceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    emailEnabled: { type: Boolean, default: true },
    browserEnabled: { type: Boolean, default: true },
    daysBeforeDeadline: { type: Number, default: 2, min: 0, max: 14 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReminderPreference", reminderPreferenceSchema);
