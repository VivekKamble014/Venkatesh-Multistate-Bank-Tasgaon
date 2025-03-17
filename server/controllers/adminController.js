require("dotenv").config(); // Ensure .env is loaded
const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Debugging: Check if .env variables are loaded
console.log("✅ EMAIL_USER:", process.env.EMAIL_USER);
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true", // Convert string to boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = { sendOTP, verifyOTP }; // Corrected export

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// Send OTP to Admin Email
async function sendOTP(req, res) {
  const { email } = req.body;

  try {
    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const otp = generateOTP();
    admin.otp = otp;
    
    admin.otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    admin.otpVerification=true;
    await admin.save();

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: admin._id, email: admin.email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "2h" });


    console.log("📩 Sending OTP:", otp, "to", email);

    await transporter.sendMail({
      from: `"Venkatesh Bank" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code for Admin Login",
      text: `Your OTP for login is ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("🔥 Error Sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP", error });
  }
}



async function verifyOTP(req, res) {
  const { email, otp } = req.body;
  console.log("🔍 Received:", { email, otp });

  try {
    const admin = await User.findOne({ email, isAdmin: true });

    if (!admin) {
      console.log("⛔ Admin Not Found");
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("🔍 Admin Found:", admin);
    console.log("📌 Stored OTP:", admin.otp);
    console.log("📌 OTP Expiry:", admin.otpExpires ? new Date(admin.otpExpires).toLocaleString() : "Not Set");

    if (!admin.otp || admin.otp !== otp) {
      console.log("⛔ OTP does not match or is missing");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > admin.otpExpires) {
      console.log("⛔ OTP Expired");
      return res.status(400).json({ message: "Expired OTP" });
    }

    // Clear OTP after verification
    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    console.log("✅ OTP Cleared and Admin Saved");

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("✅ JWT Token Generated:", token);
    res.json({ message: "Admin login successful", token });
  } catch (error) {
    console.error("🔥 Error Verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP", error });
  }
}





