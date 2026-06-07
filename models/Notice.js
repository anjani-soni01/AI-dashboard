const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  content:     { type: String, required: true },
  summary:     { type: String, default: '' },       // AI generated
  priority:    { type: String, enum: ['urgent', 'important', 'general'], default: 'general' },
  category:    { type: String, default: 'General' },
  department:  { type: String, default: 'All' },
  targetYear:  { type: String, default: 'All' },
  deadline:    { type: Date },
  fileUrl:     { type: String, default: '' },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isApproved:  { type: Boolean, default: false },
  views:       { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);