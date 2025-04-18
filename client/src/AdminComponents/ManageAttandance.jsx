import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/ManageAttendance.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AdminSidebar from './AdminSidebar';

export default function ManageAttendance() {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Get logged-in admin email
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const adminEmail = storedUser?.email || "unknown@admin.com";

  useEffect(() => {
    axios.get("http://localhost:5010/api/get-all-emails")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);

  const getFullNameByEmail = (email) => {
    const user = users.find(u => u.email === email);
    return user?.fullName || email;
  };

  const sortedData = [...attendanceData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * (sortConfig.direction === "asc" ? 1 : -1);
  });

  const handleSort = (key) => {
    const direction = (sortConfig.key === key && sortConfig.direction === "asc") ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const handleSearch = () => {
    if (!selectedEmail) return alert("Please select an employee.");
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return alert("Start date cannot be after end date.");
    }

    setLoading(true);
    axios
      .get(`http://localhost:5010/api/attendance/by-email/${selectedEmail}`, {
        params: { startDate, endDate }
      })
      .then(res => setAttendanceData(res.data))
      .catch(err => {
        console.error("Fetch error:", err);
        alert("Error fetching attendance.");
      })
      .finally(() => setLoading(false));
  };

  const handleRefresh = () => {
    setStartDate("");
    setEndDate("");
    setAttendanceData([]);
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!selectedEmail) return;
    setLoading(true);
    axios
      .get(`http://localhost:5010/api/attendance/by-email/${selectedEmail}`, {
        params: { startDate, endDate }
      })
      .then(res => setAttendanceData(res.data))
      .catch(err => {
        console.error("Refresh error:", err);
        alert("Failed to refresh data.");
      })
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    axios.delete(`http://localhost:5010/api/attendance/delete/${id}`)
      .then(() => {
        alert("Deleted successfully!");
        handleSearch();
      })
      .catch(err => {
        console.error("Delete error:", err);
        alert("Delete failed.");
      });
  };

  const handleStatusChange = (id, newStatus) => {
    axios.patch(`http://localhost:5010/api/attendance/update-status/${id}`, {
      isPresent: newStatus,
      markedByType: "Admin",
      attendanceMarkedBy: adminEmail
    })
      .then(() => handleSearch())
      .catch(err => {
        console.error("Update status error:", err);
        alert("Failed to update status.");
      });
  };

  const handleMarkedByTypeChange = (id, newType) => {
    axios.patch(`http://localhost:5010/api/attendance/update-markedby/${id}`, {
      markedByType: newType,
      attendanceMarkedBy: adminEmail
    })
      .then(() => handleSearch())
      .catch(err => {
        console.error("Update markedBy error:", err);
        alert("Failed to update marked by.");
      });
  };

  const exportToExcel = () => {
    if (!attendanceData.length) return alert("No attendance data to export.");

    const sheetData = attendanceData.map((entry, index) => ({
      "S.No": index + 1,
      "Email": entry.email,
      "Full Name": getFullNameByEmail(entry.email),
      "Date": entry.date,
      "Time": entry.time,
      "Status": entry.isPresent,
      "Marked By": getFullNameByEmail(entry.attendanceMarkedBy),
      "Marked By Type": entry.markedByType || "User"
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const filename = `Attendance_${selectedEmail.replace(/[@.]/g, "_")}_${startDate || "from"}_to_${endDate || "now"}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), filename);
  };

  return (
    <div className="manage-attendance-page">
      <AdminSidebar />
      <h2>Manage Attendance</h2>

      <div className="form-group">
        <label htmlFor="user-select">Select Employee:</label>
        <select
          id="user-select"
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
        >
          <option value="">-- Select Employee --</option>
          {users.map((user, idx) => (
            <option key={idx} value={user.email}>
              {user.fullName} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

        <button onClick={handleSearch} disabled={loading}>Search</button>
        <button onClick={handleRefresh}>Refresh</button>
        <button onClick={exportToExcel} disabled={!attendanceData.length}>Export</button>
      </div>

      {sortedData.length > 0 && (
        <div className="attendance-table-container">
          <h3>Attendance Records</h3>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>#</th>
                <th onClick={() => handleSort("email")}>Email ⬍</th>
                <th>Image</th>
                <th onClick={() => handleSort("date")}>Date ⬍</th>
                <th onClick={() => handleSort("time")}>Time ⬍</th>
                <th onClick={() => handleSort("isPresent")}>Status ⬍</th>
                <th>Marked By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((entry, index) => (
                <tr key={entry._id || index}>
                  <td>{index + 1}</td>
                  <td>{entry.email}</td>
                  <td>
                    <img
                      src={entry.image}
                      alt="Attendance"
                      width="50"
                      height="50"
                      style={{ objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>
                  <td>{entry.date}</td>
                  <td>{entry.time}</td>
                  <td>
                    <select
                      value={entry.isPresent}
                      onChange={e => handleStatusChange(entry._id, e.target.value)}
                      className="status-dropdown"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Leave">Leave</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={entry.markedByType || "User"}
                      onChange={e => handleMarkedByTypeChange(entry._id, e.target.value)}
                      className="status-dropdown"
                    >
                      <option value="User">{getFullNameByEmail(entry.attendanceMarkedBy)}</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button className="action-btn edit" onClick={() => console.log("Edit:", entry)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDelete(entry._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}