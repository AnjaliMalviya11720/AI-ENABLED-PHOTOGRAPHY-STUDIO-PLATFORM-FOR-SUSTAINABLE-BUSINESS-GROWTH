const express = require("express");
const {
  registerStudio,
  loginStudio,
  getProfile,
  upgradePlan,
  updateProfile,
  changePassword,
  getPhotographerDashboard,
} = require("../controllers/studioController");
const { protect, requireStudio } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", registerStudio);
router.post("/login", loginStudio);
router.get("/profile", protect, requireStudio, getProfile);
router.put("/profile", protect, requireStudio, updateProfile);
router.put("/upgrade", protect, requireStudio, upgradePlan);
router.put("/change-password", protect, requireStudio, changePassword);
router.get("/dashboard-overview", protect, requireStudio, getPhotographerDashboard);

module.exports = router;
