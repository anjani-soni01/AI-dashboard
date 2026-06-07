const Notice = require('../models/Notice');

// GET all notices (with search & filter)
const getNotices = async (req, res) => {
  try {
    const { search, priority, department, category } = req.query;
    let query = { isApproved: true };

    if (search)     query.$text = { $search: search };
    if (priority)   query.priority = priority;
    if (department) query.department = { $in: [department, 'All'] };
    if (category)   query.category = category;

    const notices = await Notice.find(query)
      .sort({ priority: 1, createdAt: -1 })
      .populate('postedBy', 'name role');

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single notice
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('postedBy', 'name');
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    notice.views += 1;
    await notice.save();

    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST add notice
const addNotice = async (req, res) => {
  try {
    const { title, content, priority, category, department, targetYear, deadline } = req.body;

    const notice = await Notice.create({
      title, content, priority, category,
      department, targetYear, deadline,
      postedBy: req.user._id,
      isApproved: req.user.role === 'admin', // auto approve if admin
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT edit notice
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    // Only poster or admin can edit
    if (notice.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE notice
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (notice.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await notice.deleteOne();
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotices, getNoticeById, addNotice, updateNotice, deleteNotice };