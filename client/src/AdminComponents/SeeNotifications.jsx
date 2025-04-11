import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import "../styles/SeeNotification.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function SeeNotifications() {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const adminData = JSON.parse(localStorage.getItem("admin"));
  const email = adminData?.email;

  useEffect(() => {
    axios.get("http://localhost:5010/api/get-all-emails")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch employees:", err));
  }, []);

  const handleSearch = () => {
    if (!selectedEmail) return alert("Please select an employee.");

    axios.get(`http://localhost:5010/api/notifications/${selectedEmail}?sort=${sortOrder}`)
      .then(res => setNotifications(res.data))
      .catch(err => {
        console.error("Failed to fetch notifications:", err);
        alert("Error fetching notifications");
      });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5010/api/notifications/delete/${id}`);
      setNotifications(notifications.filter(note => note._id !== id));
      alert("Notification deleted successfully.");
    } catch (error) {
      console.error("Error deleting notification:", error);
      alert("Failed to delete notification.");
    }
  };

  const handleRefresh = () => {
    if (!selectedEmail) return alert("Please select an employee.");
  
    // Use same logic as handleSearch
    axios.get(`http://localhost:5010/api/notifications/${selectedEmail}?sort=${sortOrder}`)
      .then((res) => {
        setNotifications(res.data);
        alert("Notifications refreshed.");
      })
      .catch((err) => {
        console.error("Failed to refresh notifications:", err);
        alert("Error refreshing notifications");
      });
  };
const handleExportExcel = () => {
  if (notifications.length === 0) return alert("No notifications to export.");

  const data = notifications.map((note, index) => ({
    "No.": index + 1,
    Date: new Date(note.createdAt).toLocaleString(),
    From: `${note.senderName} (${note.senderEmail})`,
    To: `${note.receiverName} (${note.receiverEmail})`,
    Subject: note.subject,
    Message: note.message,
    Status: note.isSeen ? "Seen" : "Unseen",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Notifications");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(file, `Notifications_Report_${selectedEmail}.xlsx`);
};

  return (
    <div className="see-notification-page">
      <AdminSidebar />
      <div className="see-notification-content">
        <h2>See Notifications</h2>

        <div className="form-group">
          <label>Select Employee:</label>
          <select
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
          <label>Sort By Date:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Latest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <div className="button-group">
        <button className="refresh-btn" onClick={handleRefresh}>
  🔄 Refresh
</button>  <button className="export-btn" onClick={handleExportExcel}>📁 Export to Excel</button>
</div>

        <button className="search-btn" onClick={handleSearch}>Search</button>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p>No notifications to display.</p>
          ) : (
            notifications.map((note, idx) => (
              <div key={idx} className="notification-card">
              <p><strong>Date:</strong> {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString()}</p>                <p><strong>From:</strong> {note.senderName} ({note.senderEmail})</p>
                <p><strong>To:</strong> {note.receiverName} ({note.receiverEmail})</p>
                <p><strong>Subject:</strong> {note.subject}</p>
                <p><strong>Message:</strong> {note.message}</p>
                <p><strong>Status:</strong> {note.isSeen ? "✅ Seen" : "❌ Unseen"}</p>
                {note.attachment && (
                  <p><strong>Attachment:</strong> 
                    <a href={`http://localhost:5010/uploads/${note.attachment}`} target="_blank" rel="noreferrer">
                      View Attachment
                    </a>
                  </p>
                )}
                <button className="delete-btn" onClick={() => handleDelete(note._id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}