import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Notifications.css';

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("admin") || localStorage.getItem("user"));
  const email = user?.email;

  useEffect(() => {
    if (email) {
      axios.get(`http://localhost:5010/api/notifications/${email}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error("Error fetching notifications:", err));
    }
  }, [email]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString(); // includes time too
  };
  const handleReply = async () => {
    try {
      const formData = new FormData();
      formData.append("senderName", user.name);
      formData.append("senderEmail", user.email);
      formData.append("senderDepartment", user.department);
      formData.append("senderRole", user.role);
      formData.append("receiverName", selectedNotification.senderName);
      formData.append("receiverEmail", selectedNotification.senderEmail);
      formData.append("receiverDepartment", selectedNotification.senderDepartment);
      formData.append("receiverRole", selectedNotification.senderRole);
      formData.append("originalSubject", selectedNotification.subject);
      formData.append("replyMessage", replyMessage);
      // formData.append("attachment", file); // Uncomment if you're handling file upload
  
      await axios.post("http://localhost:5010/api/notifications/send", formData);
  
      alert("Reply sent successfully!");
      setReplyMessage("");
      setSelectedNotification(null);
    } catch (error) {
      alert("Error sending reply.");
      console.error(error);
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
            <p style={{ whiteSpace: 'pre-line' }}>{selectedNotification.message}</p>

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