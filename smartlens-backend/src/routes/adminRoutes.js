const express = require("express");
const { protect, requireStudio, isAdmin } = require("../middleware/authMiddleware");
const { getAdminDashboard } = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", protect, requireStudio, isAdmin, getAdminDashboard);

module.exports = router;
