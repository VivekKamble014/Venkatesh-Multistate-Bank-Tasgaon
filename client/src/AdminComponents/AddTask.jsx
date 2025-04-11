import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import "../styles/AddTask.css";
import AssignTasks from './AssignTasks';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const location = useLocation();
  const { employee } = location.state || {};
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const navigate = useNavigate();

  const storedAdmin = JSON.parse(localStorage.getItem("admin"));
const adminEmail = storedAdmin?.email || "admin@venkateshbank.com"; // fallback if missing
  // ✅ Fetch tasks when component mounts
  useEffect(() => {
    if (employee?.email) {
      setLoadingTasks(true);
      axios.get(`http://localhost:5010/api/get-tasks-by-email?email=${employee.email}`)
        .then(res => {
          setTasks(res.data);
        })
        .catch(err => {
          console.error("Error fetching tasks:", err);
        })
        .finally(() => setLoadingTasks(false));
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      employeeID: employee.employeeID,
      employeeEmail: employee.email,
      employeeName: employee.fullName,
      assignedBy: adminEmail,

      taskTitle,
      taskDescription,
      dueDate,
      status: "Pending",
      createdAt: new Date()
    };

    try {
      await axios.post("http://localhost:5010/api/add-task", taskData);
      setMessage("✅ Task assigned successfully!");
      setTaskTitle('');
      setTaskDescription('');
      setDueDate('');

      // ✅ Refresh task list
      const updated = await axios.get(`http://localhost:5010/api/get-tasks-by-email?email=${employee.email}`);
      setTasks(updated.data);

    } catch (error) {
      console.error("❌ Error assigning task:", error);
      setMessage("Failed to assign task.");
    }
  };

  if (!employee) {
    return <p>No employee selected</p>;
  }

  return (
    <div className="add-task-page">
      <AdminSidebar />
      <div className="task-form-container">
        <h2>Assign Task to {employee.fullName}</h2>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Role:</strong> {employee.jobRole}</p>
        <p><strong>Employee ID:</strong> {employee.employeeID}</p>

        <form onSubmit={handleSubmit} className="task-form">
          <label>Task Title</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />

          <label>Task Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />

          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <button type="submit" className="assign-task-button">Assign Task</button>
          
          <button
  type="button"
  onClick={() => navigate('/AssignTasks')}
  className="cancle-task-button"
>
  Cancel
</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>

      <div className="employee-tasks">
        <h3>📝 Assigned Tasks for {employee.fullName}</h3>
        {loadingTasks ? (
  <p>Loading tasks...</p>
) : tasks.length > 0 ? (
  <div className="task-table-container">
    <table className="task-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Task Title</th>
          <th>Status</th>
          <th>Description</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={task._id}>
            <td>{index + 1}</td>
            <td>{task.taskTitle}</td>
            <td>{task.status}</td>
            <td>{task.taskDescription}</td>
            <td>{new Date(task.dueDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p>No tasks assigned yet.</p>
)}
      </div>
    </div>
  );
};

export default AddTask;