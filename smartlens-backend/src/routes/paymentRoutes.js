const express = require("express");
const { protect, requireStudio } = require("../middleware/authMiddleware");
const {
  createPayment,
  getPaymentHistory,
  getEarningsSummary,
} = require("../controllers/paymentController");

const router = express.Router();


router.post("/pay", protect, requireStudio, createPayment);
router.get("/history", protect, requireStudio, getPaymentHistory);
router.get("/earnings", protect, requireStudio, getEarningsSummary);

module.exports = router;
