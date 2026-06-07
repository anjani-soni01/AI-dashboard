const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const User = require('../models/User');

router.get('/stats', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const totalNotices     = await Notice.countDocuments({ isApproved: true });
    const importantNotices = await Notice.countDocuments({ priority: { $in: ['urgent', 'important'] }, isApproved: true });
    const upcomingEvents   = await Event.countDocuments({ date: { $gte: new Date() } });
    const totalStudents    = await User.countDocuments({ role: 'student' });
    const placements       = await Notice.countDocuments({ category: 'Placement', isApproved: true });

    res.json({ totalNotices, importantNotices, upcomingEvents, totalStudents, placements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;