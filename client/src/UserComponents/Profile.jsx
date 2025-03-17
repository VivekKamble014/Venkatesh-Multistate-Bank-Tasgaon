import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import "../styles/Profile.css";
import pImage from "../assets/empProfile.png";
export default function Profile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const token = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || !userEmail) {
        setError("Unauthorized access. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5010/api/employees?email=${encodeURIComponent(userEmail)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        //console.log("✅ Employee Data:", data);
        setEmployee(data);
      } catch (error) {
        //console.error("❌ Error fetching data:", error);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleEditProfile = () => {
    navigate("/EmployeeDashboard"); // Redirect to an edit form
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    try {
      const response = await fetch(`http://localhost:5010/api/employees?email=${encodeURIComponent(userEmail)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete profile.");
      }

      alert("Profile deleted successfully!");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      navigate("/login");
    } catch (error) {
      alert("Error deleting profile. Please try again.");
    }
  };

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        <h2>Employee Profile</h2>

        {loading && <p>Loading profile...</p>}
        {error && <p className="error-message">{error}</p>}

        {employee && (
          <div className="profile-card">
            <img
              src={pImage}
              alt="Profile"
              className="profile-image"
            />
            <h3>Welcome , {employee.fullName}</h3>
            <p><strong>Name:</strong> {employee.fullName}</p>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Mobile:</strong> {employee.mobile}</p>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>Job Role:</strong> {employee.jobRole}</p>
            <p><strong>DOB:</strong> {new Date(employee.dob).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {employee.gender}</p>
            <p><strong>Joining Date:</strong> {new Date(employee.joinDate).toLocaleDateString()}</p>

            {/* Address Section */}
            <h3>Address</h3>
            <p><strong>Street:</strong> {employee.address?.street || "N/A"}</p>
            <p><strong>Landmark:</strong> {employee.address?.landmark || "N/A"}</p>
            <p><strong>Locality:</strong> {employee.address?.locality || "N/A"}</p>
            <p><strong>State:</strong> {employee.address?.state}</p>
            <p><strong>District:</strong> {employee.address?.district}</p>
            <p><strong>Taluka:</strong> {employee.address?.taluka}</p>
            <p><strong>Pincode:</strong> {employee.address?.pincode}</p>


            <div className="profile-actions">
              <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
              <button className="delete-btn" onClick={handleDeleteProfile}>Delete Profile</button>
            </div>
          </div>
          
        )}
      </div>
    </div>
  );
}