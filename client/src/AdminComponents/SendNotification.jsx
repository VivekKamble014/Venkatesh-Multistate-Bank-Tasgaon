import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import "../styles/SendNotification.css";

export default function SendNotification() {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    message: "",
    attachment: null,
  });

  const [receiver, setReceiver] = useState({});
  const [admin, setAdmin] = useState({}); // ✅ fix: define admin state

  const adminData = JSON.parse(localStorage.getItem("admin"));
  const email = adminData?.email;

  useEffect(() => {

  
  axios.get("http://localhost:5010/api/get-all-emails")
    .then(res => {
      console.log("All employees:", res.data); // ✅ check what's inside
      setUsers(res.data);
    })
    .catch(err => console.error("Failed to fetch employees:", err));
    if (email) {
      axios.get(`http://localhost:5010/api/employees?email=${email}`)
        .then(res => {
          console.log("Fetched Admin Data:", res.data); // ✅ log admin data
          setAdmin(res.data);
        })
        .catch(err => console.error("Admin fetch error:", err));
    }
  }, [email]);
  
  const openPopup = () => {
    const emp = users.find(u => u.email === selectedEmail);
    if (!emp) return alert("Please select a valid employee.");
    setReceiver(emp);
    setPopupVisible(true);
  };

  const handleSend = async () => {
    const data = new FormData();
    data.append("senderName", admin.fullName);
    data.append("senderEmail", admin.email);
    data.append("senderDepartment", admin.department);
    data.append("senderRole", admin.jobRole);
    data.append("receiverName", receiver.fullName);
    data.append("receiverEmail", receiver.email);
    data.append("receiverDepartment", receiver.department);
    data.append("receiverRole", receiver.jobRole);
    data.append("subject", form.subject);
    data.append("message", form.message);
    data.append("date", new Date().toLocaleDateString());
    if (form.attachment) {
      data.append("attachment", form.attachment);
    }

    try {
      await axios.post("http://localhost:5010/api/notifications/send", data);
      alert("Notification sent!");
      setPopupVisible(false);
      // Optionally reset form
      setForm({ subject: "", message: "", attachment: null });
      setSelectedEmail("");
    } catch (err) {
      console.error("Sending failed:", err);
      alert("Sending failed!");
    }
  };

  return (
    <div className="send-notification-page">
      <AdminSidebar />
      <div className="send-notification-content">
        <h2>Send Notification</h2>

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

        <button className="send-btn" onClick={openPopup}>Send Notification</button>
      </div>

      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Notification Letter</h3>
            <p><strong>From:</strong> {admin.fullName} ({admin.department} - {admin.jobRole})</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>To:</strong> {receiver.fullName} ({receiver.department} - {receiver.jobRole})</p>
            <p><strong>Email:</strong> {receiver.email}</p>

            <label>Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />

            <label>Message</label>
            <textarea
              rows="5"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />

            <label>Attachment</label>
            <input
              type="file"
              onChange={(e) => setForm({ ...form, attachment: e.target.files[0] })}
            />

            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}