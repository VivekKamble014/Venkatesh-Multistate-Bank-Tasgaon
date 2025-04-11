import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { Menu, X, User, LayoutDashboard, CheckSquare, BarChart, Bell, FileText, Settings, LogOut } from "lucide-react";
import "../styles/Sidebar.css";
import { CalendarCheck } from 'lucide-react';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const location = useLocation(); // Get current route path
  const navigate = useNavigate(); // For redirection

  // Handle screen resize to show sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    navigate("/login"); // Redirect to login page
  };



  return (
    <>
      {/* Sidebar Toggle Button (Only for Small Screens) */}
      {window.innerWidth <= 768 && (
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      )}

      {/* Sidebar Container */}
      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        {/* Welcome Message */}
        <div className="welcome-message">
          <h2>Welcome Admin!</h2>
        </div>

        <ul className="sidebar-menu">
          <li className={location.pathname === "/AdminProfile" ? "active" : ""}>
            <Link to="/AdminProfile">
              <User size={22} />
              <span>Profile</span>
            </Link>
          </li>
          <li className={location.pathname === "/AdminDashboard" ? "active" : ""}>
            <Link to="/AdminDashboard">
              <LayoutDashboard size={22} />
              <span>Dashboard</span>
            </Link>
          </li>

<li className={`nav-item ${location.pathname === "/ManageAttandance" ? "active" : ""}`}>
  <Link to="/ManageAttandance" className="nav-link">
    <CalendarCheck size={22} className="nav-icon" />
    <span className="nav-text">ManageAttandance</span>
  </Link>
</li>
          <li className={location.pathname === "/Tasks" ? "active" : ""}>
            <Link to="/Tasks">
              <CheckSquare size={22} />
              <span>Tasks</span>
            </Link>
          </li>
          <li className={location.pathname === "/AssignTasks" ? "active" : ""}>
            <Link to="/AssignTasks">
              <CheckSquare size={22} />
              <span>Assign Tasks</span>
            </Link>
          </li>
          <li className={location.pathname === "/EmployeeProgress" ? "active" : ""}>
            <Link to="/EmployeeProgress">
              <BarChart size={22} />
              <span>Employee Progress</span>
            </Link>
          </li>
          <li className={location.pathname === "/SendNotification" ? "active" : ""}>
            <Link to="/SendNotification">
              <Bell size={22} />
              <span>Send Notification</span>
            </Link>
          </li>
          <li className={location.pathname === "/SeeNotifications" ? "active" : ""}>
            <Link to="/SeeNotifications">
              <Bell size={22} />
              <span>See Notifications</span>
            </Link>
          </li>
          <li className={location.pathname === "/ManageProfile" ? "active" : ""}>
            <Link to="/ManageProfile">
              <Settings size={22} />
              <span>Manage Profile</span>
            </Link>
          </li>
          <li className={location.pathname === "/Reports" ? "active" : ""}>
            <Link to="/Reports">
              <FileText size={22} />
              <span>Reports</span>
            </Link>
           
          </li>

          {/* Logout Button */}
          <li className="logout">
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={22} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;