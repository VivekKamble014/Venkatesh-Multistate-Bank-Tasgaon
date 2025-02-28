import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css"; // Import CSS file

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (/^\d{10}$/.test(mobile)) {
      setError("");
      navigate("/admin-validation"); // Redirect to Admin Validation
    } else {
      setError("Please enter a valid 10-digit mobile number.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Admin Login</h1>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          maxLength={10}
          className="input-field"
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLogin} className="login-btn">
          Send OTP
        </button>
      </div>
    </div>
  );
}