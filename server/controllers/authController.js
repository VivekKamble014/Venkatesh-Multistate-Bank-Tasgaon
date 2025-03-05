
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ Register User
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Convert email to lowercase for consistency
  const normalizedEmail = email.toLowerCase();

  // Check if user already exists
  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    if (!user.isVerified) {
      // Generate a new verification token
      const verificationToken = user.getVerificationToken();
      await user.save({ validateBeforeSave: false });

      // Send verification email
      const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verifyemail/${verificationToken}`;
      const message = `This mail is from Venkatesh Multistate Bank, Tasgaon Branch.
      Please verify your email by clicking the following link: ${verificationUrl}`;

      await sendEmail({
        email: user.email,
        subject: "Resend Email Verification",
        message,
      });

      return res.status(200).json({
        success: true,
        message: "Verification email resent",
      });
    }

    return res.status(400).json({ message: "Employee already exists and is verified" });
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  user = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
    isVerified: false,
  });

  if (user) {
    // Generate verification token
    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verifyemail/${verificationToken}`;
    const message = `This mail is from Venkatesh Multistate Bank, Tasgaon Branch.
    Please verify your email by clicking the following link: ${verificationUrl}`;

    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      message,
    });

    res.status(201).json({
      success: true,
      message: "Verification email sent",
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// ✅ Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;

  await user.save();

  res.status(200).json({ success: true, message: "Email verified successfully" });
});

// ✅ Login User
// const loginUser = asyncHandler(async (req, res) => {
//   try {
//     console.log("Login Request:", req.body);

//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     // Convert email to lowercase for consistency
//     const normalizedEmail = email.toLowerCase();

//     // Find user
//     const user = await User.findOne({ email: normalizedEmail });

//     console.log("Found User:", user);

//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     if (!user.isVerified) {
//       return res.status(403).json({ message: "Please verify your email before logging in." });
//     }

//     // Compare hashed passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("Password Match:", isMatch);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Generate JWT Token
//     const token = generateToken(user._id);

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: { id: user._id, email: user.email, isVerified: user.isVerified },
//     });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        fullName: user.fullName || null, // Include fullName in response
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Export the function properly
module.exports = { registerUser, verifyEmail, loginUser };