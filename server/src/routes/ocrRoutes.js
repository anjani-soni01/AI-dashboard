const express = require("express");
const { extractText } = require("../controllers/ocrController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/extract", protect, upload.single("image"), extractText);

module.exports = router;
