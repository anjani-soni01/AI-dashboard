const express = require("express");
const { summarize } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/summarize", protect, summarize);

module.exports = router;
