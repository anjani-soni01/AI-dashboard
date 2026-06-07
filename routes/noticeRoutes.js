const express = require('express');
const router = express.Router();
const { getNotices, getNoticeById, addNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, getNotices);
router.get('/:id', protect, getNoticeById);
router.post('/', protect, authorizeRoles('admin', 'faculty'), addNotice);
router.put('/:id', protect, authorizeRoles('admin', 'faculty'), updateNotice);
router.delete('/:id', protect, authorizeRoles('admin', 'faculty'), deleteNotice);

module.exports = router;