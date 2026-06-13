const express = require("express");
const {
  createNotice,
  deleteNotice,
  getNoticeById,
  getNoticeSummary,
  getNotices,
  updateNotice
} = require("../controllers/noticeController");
const { adminOnly, protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", protect, getNotices);
router.get("/:id", protect, getNoticeById);
router.get("/:id/summary", protect, getNoticeSummary);
router.post("/", protect, adminOnly, upload.single("image"), createNotice);
router.put("/:id", protect, adminOnly, upload.single("image"), updateNotice);
router.delete("/:id", protect, adminOnly, deleteNotice);

module.exports = router;
