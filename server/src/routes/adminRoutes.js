const express = require("express");
const { getUsers, updateUserRole } = require("../controllers/adminController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protect, adminOnly, getUsers);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;
