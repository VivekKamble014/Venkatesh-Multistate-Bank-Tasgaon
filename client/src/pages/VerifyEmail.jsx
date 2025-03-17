import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/VerifyEmail.css"; // Import CSS

const VerifyEmail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    // Cleanup timer when component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        <CheckCircle className="verify-icon" />
        <h2 className="verify-title">Email Verified Successfully!</h2>
        <p className="verify-text">
          Your email has been verified successfully. Redirecting to login...
        </p>
        <button onClick={() => navigate("/login")} className="verify-button">
          Go to Login Now
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;