
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
      const user = JSON.parse(localStorage.getItem("user")); // ✅ Extract user object
      const userEmail = user?.email; // ✅ Get email from user object

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
        setEmployee(data);
      } catch (error) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

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
      <Sidebar />
      <div className="profile-content">
        <h2>Employee Profile</h2>

        {loading && <p>Loading profile...</p>}
        {error && <p className="error-message">{error}</p>}

        {employee && (
          <div className="profile-card">
            <img src={pImage} alt="Profile" className="profile-image" />
            <h3>Welcome, {employee.fullName}</h3>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}