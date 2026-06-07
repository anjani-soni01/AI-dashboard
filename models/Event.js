const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  date:         { type: Date, required: true },
  location:     { type: String, default: '' },
  department:   { type: String, default: 'All' },
  organizer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrations:[ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
  maxSeats:     { type: Number, default: 100 },
  isOpen:       { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);