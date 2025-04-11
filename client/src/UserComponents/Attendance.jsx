import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../UserComponents/Sidebar";
import DatePicker from "react-datepicker";
import Papa from "papaparse"; // Import PapaParse for CSV export
import "react-datepicker/dist/react-datepicker.css";
import "../styles/Attendance.css";
import { FaSearch, FaSyncAlt, FaFileCsv } from "react-icons/fa"; // Import icons


export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc' or 'desc'
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("authToken");
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeEmail = user?.email;
  
      if (!token || !employeeEmail) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }
  
      // Fetch attendance records
      const attendanceResponse = await axios.get("http://localhost:5010/api/attendance/history", {
        params: { email: employeeEmail },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const attendanceData = attendanceResponse.data;
  
      // Fetch user details
      const userResponse = await axios.get("http://localhost:5010/api/employees", {
        params: { email: employeeEmail },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userData = userResponse.data; // Assuming the response contains fullName and employeeID
  
      // Merge user details with attendance records
      const updatedAttendanceRecords = attendanceData.map(record => ({
        ...record,
        fullName: userData.fullName,
        employeeID: userData.employeeID
      }));
  
      setAttendanceRecords(updatedAttendanceRecords);
      setFilteredRecords(updatedAttendanceRecords);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };


  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSearch = () => {
    let filtered = attendanceRecords;

    if (selectedMonth) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.toLocaleString("default", { month: "long" }) === selectedMonth;
      });
    }

    if (startDate && endDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    setFilteredRecords(filtered);
  };

  const handleRefresh = () => {
    setSelectedMonth("");
    setStartDate(null);
    setEndDate(null);
    fetchAttendanceData();
  };

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };


  const handleExportCSV = () => {
    const csvData = filteredRecords.map((record, index) => ({
      No: index + 1,
      EmployeeID: record.employeeId,
      Name: record.name,
      Date: new Date(record.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      Time: record.time,
      IsPresent: record.isPresent ? "Yes" : "No",
      PresentMarkedBy: record.presentMarkedBy,
      ImageURL: record.image, // Image URL for reference
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleSort = (column) => {
    const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  
    const sorted = [...filteredRecords].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
  
      // Handle nested or formatted values
      if (column === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
  
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
  
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  
    setFilteredRecords(sorted);
  };
  const getSortIcon = (column) => {
    if (sortColumn !== column) return "↕";
    return sortDirection === "asc" ? "▲" : "▼";
  };
  return (
    <div className="attendance">
      <div className="attendance-page">
        <Sidebar />
        <div className="attendance-content">
          <h2>My Attendance History</h2>
          {loading && <p>Loading attendance data...</p>}
          {error && <p className="error-message">Error: {error}</p>}

          {/* Filter Section */}
          <div className="filter-section">
          <div className="searchmonth">

            <label>Filter by Month:</label>
            <select value={selectedMonth} onChange={handleMonthChange}>
              <option value="">All Months</option>
              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <button onClick={handleSearch} className="search-btn">Search</button>
          </div>

            <label>Filter by Date Range:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
            />
            <h5>to</h5>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="End Date"
            />

<button onClick={handleSearch} className="search-btn">Search</button>
<button onClick={handleRefresh} className="icon-btn">
  <FaSyncAlt />
</button>
<button onClick={handleExportCSV} className="icon-btn">
  <FaFileCsv />
</button>

          </div>

          {/* Attendance Table */}
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
            <thead>
  <tr>
    <th >No </th>
    <th onClick={() => handleSort("employeeID")}>Employee ID {getSortIcon("employeeID")}</th>
    <th onClick={() => handleSort("fullName")}>Name {getSortIcon("fullName")}</th>
    <th onClick={() => handleSort("date")}>Date {getSortIcon("date")}</th>
    <th onClick={() => handleSort("time")}>Time {getSortIcon("time")}</th>
    <th onClick={() => handleSort("isPresent")}>Present {getSortIcon("isPresent")}</th>
    <th onClick={() => handleSort("attendanceMarkedBy")}>Marked By {getSortIcon("attendanceMarkedBy")}</th>
    <th>Image</th>
  </tr>
</thead>
              <tbody>
  {filteredRecords.length === 0 ? (
    <tr>
      <td colSpan="8">No attendance records found.</td>
    </tr>
  ) : (
    filteredRecords.map((record, index) => (
      <tr key={record._id}>
        <td>{index + 1}</td>
        <td>{record.employeeID}</td> {/* Fetched from users collection */}
        <td>{record.fullName}</td> {/* Fetched from users collection */}
        <td>{new Date(record.date).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric"
        })}</td>
        <td>{record.time}</td>
        <td>{record.isPresent ? "Yes" : "No"}</td>
        <td>{record.attendanceMarkedBy}</td>
        <td>
          {record.image ? (
            <img 
              src={record.image} 
              alt="Attendance" 
              width="50" 
              height="50" 
              className="clickable-image"
              onClick={() => handleImageClick(record.image)}
            />
          ) : (
            "No Image"
          )}
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={selectedImage} alt="Expanded Attendance" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}
