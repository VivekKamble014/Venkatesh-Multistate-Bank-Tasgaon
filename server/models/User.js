const mongoose = require("mongoose");
const crypto = require("crypto");
const { type } = require("os");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileUpdate : {type: Boolean, default: false},
  isAdmin : {type: Boolean, default: false},
  isVerified: { type: Boolean, default: false },
  otp: { type: String, default: null },  // ✅ Ensure default value
  otpExpires: { type: Number, default: null }, // ✅ Store as timestamp
  otpVerification:{type: Boolean, default: false},
  verificationToken: String,
  verificationTokenExpire: Date,
});
// ✅ Method to Generate Email Verification Token
UserSchema.methods.getVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.verificationToken = crypto.createHash("sha256").update(token).digest("hex");
  this.verificationTokenExpire = Date.now() + 10 * 60 * 1000; // 10 mins

  return token;
};

module.exports = mongoose.model("User", UserSchema);