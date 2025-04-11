import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from "./Sidebar";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import "../styles/YourProgress.css";

const COLORS = ['#00C49F', '#FF8042'];

export default function YourProgress() {
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [attendance, setAttendance] = useState([]);
  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.isPresent === "Present").length;
  const absentDays = attendance.filter(a => a.isPresent === "Absent").length;
  const leaveDays = attendance.filter(a => a.isPresent === "Leave").length; // <- not needed if 'Leave' isn't in enum
  const [loading, setLoading] = useState(true);
  const attendancePercentage = totalDays
  ? ((presentDays / totalDays) * 100).toFixed(2)
  : 0;

const attendancePie = [
  { name: 'Present', value: presentDays },
  { name: 'Absent', value: absentDays },
  { name: 'Leave', value: leaveDays },
];


useEffect(() => {
  const email = localStorage.getItem("userEmail");
  setUserEmail(email);
  if (email) {
    Promise.all([
      axios.get(`http://localhost:5010/api/get-tasks-by-email?email=${email}`),
      axios.get(`http://localhost:5010/api/attendance/by-email?email=${email}`)
    ])
    .then(([taskRes, attendanceRes]) => {
      setTasks(taskRes.data);
      setAttendance(attendanceRes.data);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }
}, []);

  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const total = tasks.length;
  const completionPercentage = total ? ((completed / total) * 100).toFixed(2) : 0;

  const performanceMessage =
    completionPercentage >= 80
      ? "Excellent"
      : completionPercentage >= 60
      ? "Good"
      : completionPercentage >= 40
      ? "Average"
      : "Needs Improvement";

  const pieData = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending }
  ];

  const barData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const completedCount = tasks.filter(task => {
      const date = new Date(task.completedAt);
      return task.status === "Completed" && date.getMonth() + 1 === month;
    }).length;
    const pendingCount = tasks.filter(task => {
      const date = new Date(task.createdAt);
      return task.status === "Pending" && date.getMonth() + 1 === month;
    }).length;

    return {
      name: new Date(0, i).toLocaleString('default', { month: 'short' }),
      Completed: completedCount,
      Pending: pendingCount
    };
  });

  const exportToExcel = () => {
    const sheetData = tasks.map(task => ({
      "Task Title": task.taskTitle,
      "Status": task.status,
      "Assigned Date": new Date(task.createdAt).toLocaleDateString(),
      "Completed Date": task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "Not Completed"
    }));

    // Add summary rows
    sheetData.push({});
    sheetData.push({ "Task Title": "Total Tasks", "Status": total });
    sheetData.push({ "Task Title": "Completed", "Status": completed });
    sheetData.push({ "Task Title": "Pending", "Status": pending });
    sheetData.push({ "Task Title": "Completion %", "Status": `${completionPercentage}%` });
    sheetData.push({ "Task Title": "Performance", "Status": performanceMessage });

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task Summary");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `${userEmail}-task-report.xlsx`);
  };

  return (
    <div className="your-progress-container">
      <Sidebar />
      <div className="content" style={{ marginLeft: '15%', padding: '20px' }}>
        <h2>Your Task Progress</h2>

        <div style={{ marginTop: '30px' }} className='summary-section'>
          <h3>Summary</h3>
          <p>Total Tasks: {total}</p>
          <p>Completed: {completed}</p>
          <p>Pending: {pending}</p>
          <p>Completion Percentage: {completionPercentage}%</p>
          <p style={{
            color:
              completionPercentage >= 80 ? 'green' :
              completionPercentage >= 60 ? 'orange' :
              'red',
            fontWeight: 'bold'
          }}>
            Performance: {performanceMessage}
          </p>
        </div>
      
        <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
          <div style={{ width: 400 }}>
            <h3>Completion Ratio</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: '600px' }}>
            <h3>Monthly Task Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completed" fill="#00C49F" />
                <Bar dataKey="Pending" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="summary-section">
  <h3>Attendance Summary</h3>
  <p>Total Days Recorded: {totalDays}</p>
  <p>Present: {presentDays}</p>
  <p>Absent: {absentDays}</p>
  <p>Leave: {leaveDays}</p>
  <p>Attendance Percentage: {attendancePercentage}%</p>
</div>
<div style={{ width: 400 }}>
  <h3>Attendance Ratio</h3>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={attendancePie}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
        dataKey="value"
      >
        <Cell fill="#00C49F" />
        <Cell fill="#FF6347" />
        <Cell fill="#FFD700" />
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>
        <button
          onClick={exportToExcel}
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Export as Excel
        </button>
      </div>
    </div>
  );
}