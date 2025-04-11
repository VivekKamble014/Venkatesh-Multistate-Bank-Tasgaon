import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../AdminComponents/AdminSidebar";
import "../styles/Profile.css";
import pImage from "../assets/bank.png";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (!storedAdmin) {
      setError("Unauthorized access. Redirecting...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 sec
      return;
    }

    try {
      const { email } = JSON.parse(storedAdmin);

      // ✅ Fetch admin details from the backend
      axios
        .get(`http://localhost:5010/api/employees?email=${encodeURIComponent(storedAdmin)}`, { params: { email } })
        .then((response) => {
          setAdmin(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching admin details:", err);
          setError("Failed to load admin profile.");
          setLoading(false);
        });
    } catch (error) {
      console.error("Error parsing admin data:", error);
      localStorage.removeItem("admin");
      setError("Invalid admin session. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate]);
  const handleEditProfile = async () => {
    const confirmEdit = window.confirm("Are you sure you want to edit your profile?");
    
    if (!confirmEdit) return;
  
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user?.email;
  
    try {
      const response = await fetch(`http://localhost:5010/api/employees/updateProfileStatus`, {
        method: "PATCH", // Using PATCH for updating a specific field
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: userEmail, profileUpdate: false }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile status.");
      }
  
      navigate("/employeeDetails"); // Redirect after successful update
    } catch (error) {
      alert("Error updating profile status. Please try again.");
    }
  };
  return (
    <div className="profile-container">
      <AdminSidebar />
      <div className="profile-content">
        <h2>Admin Profile</h2>

        {loading && <p>Loading profile...</p>}
        {error && <p className="error-message">{error}</p>}

        {admin && (
          <div className="profile-card">
            <img src={pImage} alt="Admin Profile" className="profile-image" />
            <h3>Welcome, {admin.fullName}</h3>
            <p><strong>Name:</strong> {admin.fullName}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Mobile:</strong> {admin.mobile || "N/A"}</p>
            <p><strong>Role:</strong> {admin.role || "Administrator"}</p>
            <p><strong>DOB:</strong> {admin.dob ? new Date(admin.dob).toLocaleDateString() : "N/A"}</p>
            <p><strong>Gender:</strong> {admin.gender || "N/A"}</p>
            <p><strong>Joining Date:</strong> {admin.joinDate ? new Date(admin.joinDate).toLocaleDateString() : "N/A"}</p>

            {/* Address Section */}
            <h3>Address</h3>
            <p><strong>Street:</strong> {admin.address?.street || "N/A"}</p>
            <p><strong>Landmark:</strong> {admin.address?.landmark || "N/A"}</p>
            <p><strong>Locality:</strong> {admin.address?.locality || "N/A"}</p>
            <p><strong>State:</strong> {admin.address?.state || "N/A"}</p>
            <p><strong>District:</strong> {admin.address?.district || "N/A"}</p>
            <p><strong>Taluka:</strong> {admin.address?.taluka || "N/A"}</p>
            <p><strong>Pincode:</strong> {admin.address?.pincode || "N/A"}</p>

            <div className="profile-actions">
              <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}