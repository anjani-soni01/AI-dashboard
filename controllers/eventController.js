const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .populate('organizer', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const alreadyRegistered = event.registrations.includes(req.user._id);
    if (alreadyRegistered) return res.status(400).json({ message: 'Already registered' });

    if (event.registrations.length >= event.maxSeats) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.registrations.push(req.user._id);
    await event.save();
    res.json({ message: 'Registered successfully', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getEventById, registerForEvent };