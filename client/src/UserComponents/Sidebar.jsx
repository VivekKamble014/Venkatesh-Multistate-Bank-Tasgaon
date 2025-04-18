import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, User, LayoutDashboard, CheckSquare, BarChart, Bell, FileText, Headphones, LogOut
} from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      {/* Sidebar Toggle Button for Small Screens */}
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
          <li className={location.pathname === "/EmployeeProfile" ? "active" : ""}>
            <Link to="/EmployeeProfile">
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
          <li className={location.pathname === "/Attendance" ? "active" : ""}>
            <Link to="/Attendance">
              <Bell size={22} />
              <span>Attendance</span>
            </Link>
          </li>
          <li className={location.pathname === "/Notifications" ? "active" : ""}>
            <Link to="/Notifications">
              <Bell size={22} />
              <span>Notifications</span>
            </Link>
          </li>
          {/* <li className={location.pathname === "/Reports" ? "active" : ""}>
            <Link to="/Reports">
              <FileText size={22} />
              <span>Reports</span>
            </Link>
          </li>
          <li className={location.pathname === "/CustomerCare" ? "active" : ""}>
            <Link to="/CustomerCare">
              <Headphones size={22} />
              <span>Customer Care</span>
            </Link>
          </li> */}

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