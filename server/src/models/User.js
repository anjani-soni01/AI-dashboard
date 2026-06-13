const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

const preferencesSchema = new mongoose.Schema(
  {
    emailReminders: { type: Boolean, default: true },
    categories: {
      type: [String],
      enum: ["Academic", "Events", "Exam", "Holiday"],
      default: ["Academic", "Events", "Exam", "Holiday"]
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email address"]
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["Student", "Admin"], default: "Student" },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notice" }],
    preferences: { type: preferencesSchema, default: () => ({}) },
    lastLoginAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
