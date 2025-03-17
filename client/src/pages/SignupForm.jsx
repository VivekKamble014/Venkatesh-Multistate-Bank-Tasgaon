import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SignupForm.css";  // Import CSS file
import bb from  "../assets/registrationimg.jpg";
import { Link } from "react-router-dom";

const SignupForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();  // Hook for navigation

    const validatePassword = (password) => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      if (!validatePassword(formData.password)) {
        setError("Password must be at least 8 characters long and include letters, numbers, and symbols.");
        return;
      }

      try {
        const res = await axios.post("http://localhost:5010/api/auth/register", formData);
        console.log(res.data);
        setMessage("Registration successful! Redirecting to login...");
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        setError(error.response?.data?.message || "Something went wrong. Please try again.");
      }
    };

    return (
      <div className="signup-container">
        <div className="signup-box">
          <img src={bb} alt="Signup" className="signup-image" />
          <div className="signup-form">
            <h1>Sign Up</h1>

            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
            <form onSubmit={handleSubmit}>
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
              />
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required 
              />
              <button type="submit">Sign Up</button>
            </form>
            <p className="register-link">
         have an account? <Link to="/login">Sign In here</Link>
        </p>
          </div>
        </div>
      </div>
    );
};

export default SignupForm;