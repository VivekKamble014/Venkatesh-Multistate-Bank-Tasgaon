const express = require("express");
const { registerUser, verifyEmail, loginUser } = require("../controllers/authController"); // ✅ Correct import

const router = express.Router();

router.post("/register", registerUser); // 👈 Fix this route


router.get("/verifyemail/:token", verifyEmail); // 👈 Email verification route

router.post("/login", loginUser); // ✅ Ensure correct function name

module.exports = router;