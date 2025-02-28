import React from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import "../styles/EmployeeDashboard.css"; // Import styles

export default function EmployeeDashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Fixed Sidebar */}
      <div className="dashboard-content">
        <h1>Hello,</h1>
        <p>Welcome to the Employee Dashboard Mr. Ganesh Gawali.</p>

        {/* Attendance Section */}
        <div className="attendance-section">
          <h2>Mark Your Attendance Today</h2>
          <button className="mark-attendance-btn">Mark Attendance</button>
        </div>

        <div style={{ height: "100vh", background: "#f4f4f4" }}></div> {/* Extra content for scrolling */}
      </div>
    </div>
  );
}