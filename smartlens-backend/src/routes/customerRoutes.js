const express = require("express");
const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
} = require("../controllers/customerController");
const { protect, requireCustomer } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/profile", protect, requireCustomer, getCustomerProfile);

module.exports = router;
