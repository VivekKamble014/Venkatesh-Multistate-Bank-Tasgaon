
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminComponents/AdminSidebar";
import "../styles/AdminDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Chart colors
const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444"];

// Demo Data
const taskData = [
  { name: "Completed", value: 24 },
  { name: "Pending", value: 12 },
  { name: "In Progress", value: 8 },
  { name: "Blocked", value: 4 },
];

const attendanceData = [
  { name: "Mon", attendance: 22 },
  { name: "Tue", attendance: 25 },
  { name: "Wed", attendance: 20 },
  { name: "Thu", attendance: 18 },
  { name: "Fri", attendance: 26 },
];


export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
const [employeeCount, setEmployeeCount] = useState(0);
const [taskCount, setTaskCount] = useState(0);

useEffect(() => {
  axios.get("http://localhost:5010/api/count")
    .then((res) => setTaskCount(res.data.count))
    .catch((err) => console.error("Error fetching task count:", err));
}, []);

  useEffect(() => {
    // existing admin check code...
    
    axios.get("http://localhost:5010/api/total-employees")
      .then((res) => setEmployeeCount(res.data.count))
      .catch((err) => console.error("Error fetching employee count:", err));
  }, []);


  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (!storedAdmin) {
      setError("Unauthorized access. Redirecting...");
      return;
    }

    try {
      const { email } = JSON.parse(storedAdmin);

      axios
        .get(`http://localhost:5010/profile`, { params: { email } })
        .then((response) => {
          setAdmin(response.data);
        })
        .catch((err) => {
          console.error("Error fetching admin details:", err);
          setError("Failed to load admin profile.");
        });
    } catch (error) {
      console.error("Error parsing admin data:", error);
      setError("Invalid admin session. Redirecting...");
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 maindiv">
      <AdminSidebar />
      <div className="dashboard-container">
  <AdminSidebar />

  <main className="dashboard-main">
    <div className="dashboard-header">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-subtitle">Welcome back, Admin 👋</p>
    </div>

    {error ? (
      <div className="error-message">{error}</div>
    ) : admin ? (
      <>
        <div className="card-grid">
        <div className="stat-card">
  <h2 className="stat-title">Total Employees</h2>
  <p className="stat-value indigo">{employeeCount}</p> {/* ✅ dynamic */}
</div>
         <div className="stat-card">
  <h2 className="stat-title">Tasks Assigned</h2>
  <p className="stat-value green">{taskCount}</p> {/* ✅ dynamic */}
</div>
          <div className="stat-card">
            <h2 className="stat-title">Attendance Rate</h2>
            <p className="stat-value yellow">94%</p>
          </div>
        </div>

        <div className="chart-grid">
          <div className="chart-card">
            <h3 className="chart-title">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={taskData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Weekly Attendance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attendanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#3B82F6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    ) : (
      <p className="text-gray-600 mt-4">Loading admin details...</p>
    )}
  </main>
</div>

    </div>
  );
}