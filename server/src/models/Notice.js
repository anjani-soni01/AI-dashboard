const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    desc: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Academic", "Events", "Exam", "Holiday"],
      required: true
    },
    deadline: Date,
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium"
    },
    imageUrl: String,
    summary: String,
    pinned: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

noticeSchema.index({ title: "text", desc: "text", category: 1 });
noticeSchema.index({ deadline: 1 });

module.exports = mongoose.model("Notice", noticeSchema);
