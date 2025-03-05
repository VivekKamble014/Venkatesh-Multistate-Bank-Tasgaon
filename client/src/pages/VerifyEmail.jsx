import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/VerifyEmail.css"; // Import CSS

const VerifyEmail = () => {
  const [message, setMessage] = useState({ text: "Verifying...", type: "info" });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (!token) {
      setMessage({ text: "Invalid verification link.", type: "error" });
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(`/api/auth/verify?token=${token}`);
        console.log("Verification Response:", res.data); // Debugging
        setMessage({ text: res.data.message || "Email verified successfully!", type: "success" });
      } catch (error) {
        console.error("Verification Error:", error.response?.data || error.message);
        setMessage({
          text: error.response?.data?.message || "Verification failed. The link may have expired.",
          type: "error",
        });
      }
    };

    verify();
  }, []);

  return (
    <div className="verify-container">
      <div className="verify-box">
        <img src="/verify-email.png" alt="Email Verification" className="verify-image" />
        <h2>Email Verification</h2>
        <p className={`verify-message ${message.type}`}>{message.text}</p>
        <p className="verify-text">
          Please check your email for further instructions. If your email is verified, you can now proceed to login.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;