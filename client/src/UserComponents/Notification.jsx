import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Notifications.css';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const storedUser = localStorage.getItem("user") || localStorage.getItem("admin");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const email = user?.email;

  
console.log("user email.",email)
  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:5010/api/notifications/${email}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error("Error fetching notifications:", err));
    }
  }, [email]);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!email) return;
  
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5010/api/employees?email=${encodeURIComponent(email)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch employee details.");
  
        const data = await response.json();
        setEmployeeDetails(data);
      } catch (error) {
        console.error("Error loading employee data for reply:", error);
      }
    };
  
    fetchEmployeeDetails();
  }, [email]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString(); // includes time too
  };

  const handleReply = async () => {
    try {
      if (!replyMessage.trim()) {
        alert("Please write a reply message.");
        return;
      }
  
      const fullReply = `${replyMessage}

      -----------------
      Regards,
      ${employeeDetails?.fullName}
      ${employeeDetails?.email}
      ${employeeDetails?.department || "N/A"} | ${employeeDetails?.jobRole || "N/A"}
      `;
      
      const payload = {
        senderName: employeeDetails?.fullName,
        senderEmail: employeeDetails?.email,
        senderDepartment: employeeDetails?.department,
        senderRole: employeeDetails?.jobRole,
        receiverName: selectedNotification.senderName,
        receiverEmail: selectedNotification.senderEmail,
        receiverDepartment: selectedNotification.senderDepartment,
        receiverRole: selectedNotification.senderRole,
        subject: `RE: ${selectedNotification.subject}`,
        message: fullReply,
      };
      await axios.post("http://localhost:5010/api/notifications/send", payload);
  
      alert("Reply sent successfully!");
      setReplyMessage("");
      setSelectedNotification(null);
  
      const res = await axios.get(`http://localhost:5010/api/notifications/${email}`);
      setNotifications(res.data);
  
    } catch (error) {
      console.error("Reply Error:", error);
      alert("Error sending reply. Check console for details.");
    }
  };
  
  const handleReadMessage = async (note) => {
    setSelectedNotification(note);

    if (!note.isSeen) {
      try {
        await axios.put(`http://localhost:5010/api/notifications/mark-seen/${note._id}`);
        setNotifications(prev =>
          prev.map(n => n._id === note._id ? { ...n, isSeen: true } : n)
        );
      } catch (err) {
        console.error("Error marking as seen:", err);
      }
    }
  };

  return (
    <div className="notification-page">
      <Sidebar />
      <div className="notification-container">
        <h2>Your Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          notifications.map((note, index) => (
            <div
              className={`notification-card ${note.isSeen ? "seen" : "unseen"}`}
              key={index}
            >
              <div className="notification-header">
                <span><strong>From:</strong> {note.senderName}</span>
                <span><strong>Date:</strong> {formatDate(note.date)}</span>
              </div>
              <p><strong>Subject:</strong> {note.subject}</p>
              <button
                className="read-btn"
                onClick={() => handleReadMessage(note)}
              >
                Read Message
              </button>
            </div>
          ))
        )}
      </div>

      {selectedNotification && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{selectedNotification.subject}</h3>
            <p><strong>From:</strong> {selectedNotification.senderName} ({selectedNotification.senderEmail})</p>
            <p><strong>Department:</strong> {selectedNotification.senderDepartment || "N/A"}</p>
            <p><strong>Role:</strong> {selectedNotification.senderRole || "N/A"}</p>
            <p><strong>Date:</strong> {formatDate(selectedNotification.date)}</p>
            <hr />
            <p>message:</p>
            <h5 style={{ whiteSpace: 'pre-line' }}>{selectedNotification.message}</h5>

            {selectedNotification.attachment && (
              <a
                href={`data:${selectedNotification.attachment.contentType};base64,${btoa(
                  new Uint8Array(selectedNotification.attachment.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                  )
                )}`}
                download={selectedNotification.attachment.fileName || "attachment"}
                className="download-link"
              >
                📎 Download Attachment
              </a>
            )}
           

            <textarea
  placeholder="Write your reply..."
  rows="4"
  value={replyMessage}
  onChange={(e) => setReplyMessage(e.target.value)}
/>

{/* Always show sender details */}
<div className="sender-info">
  <h4>Your Details</h4>
  <p><strong>Name:</strong> {employeeDetails?.fullName}</p>
  <p><strong>Email:</strong> {employeeDetails?.email}</p>
  <p><strong>Department:</strong> {employeeDetails?.department || "N/A"}</p>
  <p><strong>Role:</strong> {employeeDetails?.jobRole || "N/A"}</p>
</div>

            <div className="popup-actions">
              <button onClick={handleReply}>Send Reply</button>
              <button className="close-btn" onClick={() => setSelectedNotification(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}