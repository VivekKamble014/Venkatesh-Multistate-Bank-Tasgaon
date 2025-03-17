import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { Menu, X, User, LayoutDashboard, CheckSquare, BarChart, Bell, LogOut } from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = () => {
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
          <h2>Welcome!</h2>
          
        </div>

        <ul className="sidebar-menu">
          <li className={location.pathname === "/Profile" ? "active" : ""}>
            <Link to="/Profile">
              <User size={22} />
              <span>Profile</span>
            </Link>
          </li>
          <li className={location.pathname === "/EmployeeDashboard" ? "active" : ""}>
            <Link to="/EmployeeDashboard">
              <LayoutDashboard size={22} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={location.pathname === "/YourTasks" ? "active" : ""}>
            <Link to="/YourTasks">
              <CheckSquare size={22} />
              <span>Your Tasks</span>
            </Link>
          </li>
          <li className={location.pathname === "/YourProgress" ? "active" : ""}>
            <Link to="/YourProgress">
              <BarChart size={22} />
              <span>Your Progress</span>
            </Link>
          </li>
          <li className={location.pathname === "/Notification" ? "active" : ""}>
            <Link to="/Notification">
              <Bell size={22} />
              <span>Notification</span>
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

export default Sidebar;