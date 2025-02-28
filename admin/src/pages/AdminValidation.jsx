import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminValidation.css"; // Import the CSS file

export default function AdminValidation() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleValidation = () => {
    if (otp.length === 6) {
      navigate("/admin-dashboard"); // Redirect if OTP is valid
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h1>Enter OTP</h1>
        <input
          type="text"
          className="otp-input"
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="otp-btn" onClick={handleValidation}>Validate & Proceed</button>
      </div>
    </div>
  );
}