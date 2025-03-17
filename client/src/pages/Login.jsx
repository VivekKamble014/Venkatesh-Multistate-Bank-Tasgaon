
// export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import loginImg from "../assets/login.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", otp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // ✅ Track OTP request state
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Send OTP to Admin Email
  const handleSendOtp = async () => {
    try {
      await axios.post("http://localhost:5010/send-otp", {
        email: formData.email,
      });
      setOtpSent(true);
      setError("");
      console.log("✅ OTP Sent Successfully");
    } catch (error) {
      setError("Failed to send OTP. Try again.");
    }
  };

  // ✅ Handle Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isAdmin) {
        // ✅ Admin Login using OTP
        const response = await axios.post("http://localhost:5010/verify-otp", {
          email: formData.email,
          otp: formData.otp, // Use OTP instead of password
        });

        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        console.log("✅ Admin logged in. Redirecting to Admin Dashboard...");
        navigate("/AdminDashboard");
        return;
      } 

      // ✅ Employee Login using Email & Password
      const response = await axios.post("http://localhost:5010/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Employee Dashboard Redirection
      try {
        const employeeCheckResponse = await axios.get("http://localhost:5010/api/employees", {
          params: { email: formData.email },
        });

        if (employeeCheckResponse.data && employeeCheckResponse.data.profileUpdate==true) {
          navigate("/EmployeeDashboard");
        } else {
          navigate("/EmployeeDetails");
        }
      } catch {
        navigate("/EmployeeDetails");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={loginImg} alt="Login Illustration" className="login-image" />

        <div className="login-content">
        <div className="toggle-container">
            <button className={!isAdmin ? "active" : ""} onClick={() => setIsAdmin(false)}>
              Employee SignIn
            </button>
            <button className={isAdmin ? "active" : ""} onClick={() => setIsAdmin(true)}>
              Admin SignIn
            </button>
          </div>

          <h1>{isAdmin ? "Admin SignIn" : "Employee SignIn"}</h1>

          {error && <p className="error-message">{error}</p>}

       

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email"
                value={formData.email} onChange={handleChange} required />
            </div>

            {/* ✅ Employee Login - Password Field */}
            {!isAdmin && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password"
                  value={formData.password} onChange={handleChange} required />

              </div>
              
            )}

            {/* ✅ Admin Login - OTP Handling */}
            {isAdmin && otpSent && (
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input type="text" id="otp" name="otp" placeholder="Enter OTP"
                  value={formData.otp} onChange={handleChange} required />
              </div>
            )}

            {/* Admin OTP Button */}
            {isAdmin && !otpSent && (
              <button type="button" className="otp-button" onClick={handleSendOtp}>
                Send OTP
              </button>
            )}

            {/* Forgot Password */}
            {!isAdmin && (
              <div>


              <p className="forgot-password">
                <Link to="/forgot-password">Forgot Password?</Link>
              </p>
        
              </div>
            )}

            {/* Login Button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : isAdmin ? "Verify OTP" : "Login"}
            </button>
          </form>
          {!isAdmin && (
             
            <p className="register-link">
            Don't have an account? <Link to="/signup">SignUp here</Link>
          </p>
            
            )}

        </div>
      </div>
    
    </div>
    
  );
};

export default Login;
