import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LayoutDashboard, CheckSquare, BarChart, Bell, Users, FileText, LogOut } from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const location = useLocation(); // Get current route path

  // Handle screen resize to show sidebar on large screens
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          <h2>Welcome!</h2>
          <p>Ganesh Gawali.</p>
        </div>

        <ul className="sidebar-menu">
          <li className={location.pathname === "/profile" ? "active" : ""}>
            <Link to="/profile">
              <User size={22} />
              <span>Profile</span>
            </Link>
          </li>
          <li className={location.pathname === "/EmployeeDashboard" ? "active" : ""}>
            <Link to="/dashboard">
              <LayoutDashboard size={22} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={location.pathname === "/employees" ? "active" : ""}>
            <Link to="/employees">
              <Users size={22} />
              <span>Employees</span>
            </Link>
          </li>
          <li className={location.pathname === "/tasks" ? "active" : ""}>
            <Link to="/tasks">
              <CheckSquare size={22} />
              <span>Assign Tasks</span>
            </Link>
          </li>
          <li className={location.pathname === "/progress" ? "active" : ""}>
            <Link to="/progress">
              <BarChart size={22} />
              <span>Attendance</span>
            </Link>
          </li>
          <li className={location.pathname === "/notifications" ? "active" : ""}>
            <Link to="/notifications">
              <Bell size={22} />
              <span>Notify Employee</span>
            </Link>
          </li>
          <li className={location.pathname === "/reports" ? "active" : ""}>
            <Link to="/reports">
              <FileText size={22} />
              <span>Reports</span>
            </Link>
          </li>
          <li className={`logout ${location.pathname === "/logout" ? "active" : ""}`}>
            <Link to="/logout">
              <LogOut size={22} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;