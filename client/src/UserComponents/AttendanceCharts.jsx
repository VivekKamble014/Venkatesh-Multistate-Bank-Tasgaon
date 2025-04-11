import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from "recharts";
import "../styles/EmployeeDashboard.css";

const COLORS = ["#00C49F", "#FF4444"];

export default function AttendanceCharts() {
    const [monthlyAttendance, setMonthlyAttendance] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [loading, setLoading] = useState(true);

    const employeeEmail = localStorage.getItem("userEmail");

    useEffect(() => {
      const fetchAttendanceData = async () => {
        if (!employeeEmail) return;
    
        try {
          const response = await axios.get("http://localhost:5010/api/attendance/graph", {
            params: { email: employeeEmail },
          });
    
          const rawData = response.data.attendance || [];
          if (!rawData.length) return;
    
          const monthlyStats = {};
          let presentDays = 0, totalDays = 0;
    
          rawData.forEach((record) => {
            // Parse YYYY-MM-DD string into Date object
            const date = new Date(record.date + "T00:00:00"); // Add T00:00:00 to make it ISO valid
            const monthName = date.toLocaleString("default", { month: "short", year: "numeric" });
    
            if (!monthlyStats[monthName]) {
              monthlyStats[monthName] = { month: monthName, present: 0, absent: 0 };
            }
    
            if (record.isPresent === "Present") {
              monthlyStats[monthName].present += 1;
              presentDays += 1;
            } else {
              monthlyStats[monthName].absent += 1;
            }
    
            totalDays += 1;
          });
    
          setMonthlyAttendance(Object.values(monthlyStats));
    
          setPieData([
            { name: "Present", value: presentDays },
            { name: "Absent", value: totalDays - presentDays },
          ]);
        } catch (error) {
          console.error("Failed to fetch attendance data:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchAttendanceData();
    }, [employeeEmail]);
    // Download CSV Function
    const downloadCSV = () => {
        const headers = ["Sr.No,Month,Present Days,Absent Days"];
        const rows = monthlyAttendance.map(({ month, present, absent }, index) => 
            `${index + 1},${month},${present},${absent}`
        );
        
        const csvContent = `\ufeffdata:text/csv;charset=utf-8,${[...headers, ...rows].join("\n")}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "attendance_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!employeeEmail) return <p>Please log in to view attendance data.</p>;
    if (loading) return <p>Loading attendance data...</p>;

    return (
      <div className="charts-container">
        <h3>Monthly Attendance Overview</h3>
        
        <div className="chart-wrapper">
          <div className="bar-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyAttendance}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#00C49F" name="Present Days" />
                <Bar dataKey="absent" fill="#FF4444" name="Absent Days" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pie-chart">
            <PieChart width={300} height={300}>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <div className="attendance-table">
          <h3>Monthly Attendance Count</h3>
          <button className="download-btn" onClick={downloadCSV}>📥 Download CSV</button>
          
          <table>
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Month</th>
                <th>Present Days</th>
                <th>Absent Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {monthlyAttendance.map((monthData, index) => (
                <tr key={index}>
                  <td>{index + 1}</td> {/* ✅ Corrected Sr.No */}
                  <td>{monthData.month}</td>
                  <td>{monthData.present}</td>
                  <td>{monthData.absent}</td>
                  <td>
                    <button className="view-btn">👁️ View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}