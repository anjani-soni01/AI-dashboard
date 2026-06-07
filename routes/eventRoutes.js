const express = require('express');
const router = express.Router();
const { getEvents, getEventById, registerForEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEvents);
router.get('/:id', protect, getEventById);
router.post('/:id/register', protect, registerForEvent);

module.exports = router;