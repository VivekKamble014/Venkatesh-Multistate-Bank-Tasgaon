import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import loginImg from "../assets/LoginImage.jpg";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for redirection

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post("http://localhost:5010/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
  
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userEmail", user.email);  // ✅ Store userEmail explicitly
  
      // ✅ Check if employee exists in the database
      try {
        const employeeCheckResponse = await axios.get(
          "http://localhost:5010/api/employees", // Ensure correct API route
          { params: { email: formData.email } }
        );
  
        console.log("✅ Employee Check Response:", employeeCheckResponse.data);
  
        // Explicitly log fullName before checking
        console.log("✅ Found fullName:", employeeCheckResponse.data.fullName);
  
        if (employeeCheckResponse.data && employeeCheckResponse.data.email) {
          console.log("✅ Employee exists. Redirecting to EmployeeDashboard...");
          navigate("/EmployeeDashboard");
          return;
           // ✅ Prevent further execution
        } else {
          console.log("⚠️ Employee exists, but missing fullName. Redirecting to EmployeeDetails...");
          navigate("/EmployeeDetails");
          return; // ✅ Prevent further execution
        }
      } catch (employeeCheckError) {
        console.log("⚠️ Employee not found in database. Redirecting to EmployeeDetails...");
        navigate("/EmployeeDetails");
        return; // ✅ Prevent further execution
      }
  
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message);
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
          <h1>Employee Login</h1>

          {/* Display error messages */}
           {error && <p className="error-message">{error}</p>} 

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Forgot Password Link */}
            <p className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="register-link">
            Don't have an account? <Link to="/signup">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
