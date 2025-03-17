

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../UserComponents/Sidebar";
import "../styles/EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    console.log("Stored Email:", userEmail);

    if (!token || !userEmail) {
      navigate("/login");
      return;
    }

    const fetchEmployeeData = async () => {
      setLoading(true); // Set loading to true
      setError(null); // Clear previous errors
      try {
        const response = await fetch(
          `http://localhost:5010/api/employees?email=${encodeURIComponent(
            userEmail
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch employee data: ${response.status}`);
        }

        const data = await response.json();
       // console.log("✅ Employee Data Received:", data);
        setEmployee(data);
      } catch (err) {
        //console.error("❌ Error fetching employee data:", err);
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchEmployeeData();
  }, [navigate]);

  useEffect(() => {
    if (employee) {
      //console.log("Employee state updated:", employee);
    }
  }, [employee]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        {loading && <p>Loading employee data...</p>}
        {error && <p>Error: {error}</p>}
        {employee && (
          <div className="employee-data">
            {/* Display employee data here */}
            <p>Email: {employee.email}</p>
            {/* Add other employee data fields */}
          </div>
        )}
        <div className="attendance-section">
          <h2>Mark Your Attendance Today</h2>
          <button className="mark-attendance-btn">Mark Attendance</button>
        </div>
        <div style={{ height: "100vh", background: "#f4f4f4" }}></div>
      </div>
    </div>
  );
}