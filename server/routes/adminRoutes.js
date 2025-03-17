const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware"); // Ensure middleware is correctly imported

const router = express.Router();

// Send OTP to Admin
router.post("/send-otp", sendOTP);

// Verify OTP and Login
router.post("/verify-otp", verifyOTP);

// Protected Admin Route (Test if authentication works)
router.get("/AdminDashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!" });
});





module.exports = router;
