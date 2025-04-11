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

  useEffect(() => {
    axios.get("http://localhost:5010/api/get-all-emails")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch emails:", err));
  }, []);

  const getFullNameByEmail = (email) => {
    const user = users.find(u => u.email === email);
    return user ? user.fullName : email;
  };

  const sortedData = [...attendanceData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
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
        console.error("Error fetching attendance:", err);
        alert("Error fetching attendance. See console.");
      })
      .finally(() => setLoading(false));
  };


  const handleRefresh = () => {
    setStartDate("");
    setEndDate("");
    setAttendanceData([]); // Clear table
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
        console.error("Error refreshing:", err);
        alert("Refresh failed.");
      })
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    axios.delete(`http://localhost:5010/api/attendance/delete/${id}`)
      .then(() => {
        alert("Deleted successfully!");
        handleSearch();
      })
      .catch(err => {
        console.error("Error deleting:", err);
        alert("Failed to delete.");
      });
  };

  const handleStatusChange = (id, newStatus) => {
    const markedByEmail = localStorage.getItem("userEmail");
    axios.patch(`http://localhost:5010/api/attendance/update-status/${id}`, {
      isPresent: newStatus,
      markedByType: "Admin",
      attendanceMarkedBy: markedByEmail
    }).then(() => handleSearch())
      .catch(err => {
        console.error("Error updating status:", err);
        alert("Failed to update attendance.");
      });
  };

  const handleMarkedByTypeChange = (id, newType) => {
    const markedByEmail = localStorage.getItem("userEmail");
    axios.patch(`http://localhost:5010/api/attendance/update-markedby/${id}`, {
      markedByType: newType,
      attendanceMarkedBy: markedByEmail
    }).then(() => handleSearch())
      .catch(err => {
        console.error("Error updating Marked By:", err);
        alert("Failed to update marked by.");
      });
  };

  const exportToExcel = () => {
    if (!attendanceData.length) return alert("No data to export");

    const sheetData = attendanceData.map((entry, index) => ({
      "S.No": index + 1,
      "Email": entry.email,
      "Full Name": getFullNameByEmail(entry.email),
      "Date": entry.date,
      "Time": entry.time,
      "Status": entry.isPresent,
      "Marked By": getFullNameByEmail(entry.attendanceMarkedBy),
      "Marked By Type": entry.markedByType
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    const fileName = `Attendance_${selectedEmail.replace(/[@.]/g, "_")}_${startDate || "from"}_to_${endDate || "now"}.xlsx`;
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, fileName);
  };

  return (
    <div className="manage-attendance-page">
    <AdminSidebar/>
      <h2>Manage Attendance</h2>

      <div className="form-group">
        <label htmlFor="user-select">Select Employee:</label>
        <select
          id="user-select"
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
        >
          <option value="">-- Select Employee --</option>
          {users.map((user, index) => (
            <option key={index} value={user.email}>
              {user.fullName} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <button onClick={handleSearch} disabled={loading}>Search</button>
        <button onClick={handleRefresh} className="refresh-btn">Refresh</button>
        <button onClick={exportToExcel} className="export-btn">Export to Excel</button>
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
                      alt={`Attendance of ${entry.email}`}
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
                      onChange={(e) => handleStatusChange(entry._id, e.target.value)}
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
                      onChange={(e) => handleMarkedByTypeChange(entry._id, e.target.value)}
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