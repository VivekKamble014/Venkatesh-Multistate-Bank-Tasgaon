import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import "../styles/EmployeeProgress.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';



export default function EmployeeProgress() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
// inside your component
const barChartRef = useRef(null);
const pieChartRef = useRef(null);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    axios.get("http://localhost:5010/api/get-all-emails")
      .then(res => setEmails(res.data))
      .catch(err => console.error("Failed to fetch emails:", err));
  }, []);

  useEffect(() => {
    if (selectedEmail) {
      fetchTasksByEmail(selectedEmail);
    }
  }, [selectedEmail]);

  const fetchTasksByEmail = async (email) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5010/api/get-tasks-by-email?email=${email}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyTaskStats = () => {
    const monthMap = {};

    tasks.forEach(task => {
      const month = new Date(task.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthMap[month]) {
        monthMap[month] = { Completed: 0, Pending: 0 };
      }
      monthMap[month][task.status]++;
    });

    return Object.entries(monthMap).map(([month, counts]) => ({
      month,
      Completed: counts.Completed,
      Pending: counts.Pending
    }));
  };

  const getOverallTaskStats = () => {
    const completed = tasks.filter(task => task.status === "Completed").length;
    const pending = tasks.filter(task => task.status === "Pending").length;

    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending }
    ];
  };

  const getSelectedMonthStats = () => {
    const filtered = tasks.filter(task => {
      const date = new Date(task.createdAt);
      return (
        date.getMonth() === months.indexOf(selectedMonth) &&
        date.getFullYear() === parseInt(selectedYear)
      );
    });

    const completed = filtered.filter(t => t.status === "Completed").length;
    const pending = filtered.filter(t => t.status === "Pending").length;
    const total = completed + pending;

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    let message = "No Data";

    if (percentage >= 80) message = "Excellent";
    else if (percentage >= 60) message = "Good";
    else if (percentage >= 40) message = "Average";
    else if (percentage > 0) message = "Poor";

    return { completed, pending, percentage, message };
  };
  const exportChartAsSVG = (ref, fileName) => {
    const svgElement = ref.current?.querySelector("svg");
    if (!svgElement) return alert("SVG not found!");
  
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='employee-progress-page'>
      <AdminSidebar />
      <div className='progress-content'>
        <h2>Employee Progress Overview</h2>

        <div className='email-dropdown'>
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
          >
            <option value="">-- Select Email --</option>
            {emails.map((user, index) => (
              <option key={index} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>

          {selectedEmail && (
            <button
              onClick={() => {
                setSelectedEmail("");
                setTasks([]);
              }}
            >
              Clear
            </button>
          )}
        </div>

        {selectedEmail && (
          <div className="month-year-selectors">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">-- Select Month --</option>
              {months.map((month, idx) => (
                <option key={idx} value={month}>{month}</option>
              ))}
            </select>

            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">-- Select Year --</option>
              {years.map((year, idx) => (
                <option key={idx} value={year}>{year}</option>
              ))}
            </select>
            
          </div>
        )}
        {loading ? (
  <p>Loading tasks...</p>
) : tasks.length > 0 ? (
  <div>
    {selectedMonth && selectedYear && (
      <div className="progress-summary">
        <h3>Performance in {selectedMonth} {selectedYear}</h3>
        <p>Completed: {getSelectedMonthStats().completed}</p>
        <p>Pending: {getSelectedMonthStats().pending}</p>
        <p>Completion Rate: {getSelectedMonthStats().percentage}%</p>
        <p>Performance: <strong>{getSelectedMonthStats().message}</strong></p>
      </div>
    )}

    {/* Charts */}
    <div className='chart-box' ref={barChartRef}>
      <h3>Monthly Task Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={getMonthlyTaskStats()}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Completed" fill="#4CAF50" />
          <Bar dataKey="Pending" fill="#F44336" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className='chart-box' ref={pieChartRef}>
      <h3>Overall Task Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={getOverallTaskStats()}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            <Cell fill="#4CAF50" />
            <Cell fill="#F44336" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Export Buttons */}
    <div className="export-svg-buttons">
      <button onClick={() => exportChartAsSVG(barChartRef, `${selectedEmail}-bar-chart`)}>Export Bar Chart as SVG</button>
      <button onClick={() => exportChartAsSVG(pieChartRef, `${selectedEmail}-pie-chart`)}>Export Pie Chart as SVG</button>
    </div>

  </div>
) : selectedEmail ? (
  <p>No tasks found for this email.</p>
) : null}
  
</div>
    </div>
  );
}