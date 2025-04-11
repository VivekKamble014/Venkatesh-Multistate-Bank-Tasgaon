import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import "../styles/Task.css"

export default function Tasks() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Holds the task being edited
  const [editForm, setEditForm] = useState({
    taskTitle: "",
    taskDescription: "",
    dueDate: ""
  });
  // Fetch all emails
  useEffect(() => {
    axios.get("http://localhost:5010/api/get-all-emails")
      .then(res => setEmails(res.data))
      .catch(err => console.error("Failed to fetch emails:", err));
  }, []);

  // Fetch tasks for selected email
  useEffect(() => {
    if (selectedEmail) {
      fetchTasksByEmail(selectedEmail);
    }
  }, [selectedEmail]);

  const fetchTasksByEmail = async (email) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5010/api/get-tasks-by-email?email=${email}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };
  const markAsCompleted = async (taskId) => {
    try {
      await axios.put(`http://localhost:5010/api/mark-task-completed/${taskId}`, {
        completedAt: new Date().toISOString(),
      });
      fetchTasksByEmail(selectedEmail);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await axios.put(`http://localhost:5010/api/update-task-status/${taskId}`, {
        status: currentStatus === "Completed" ? "Pending" : "Completed",
        completedAt: currentStatus === "Completed" ? null : new Date().toISOString(),
      });
      fetchTasksByEmail(selectedEmail);
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };
  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:5010/api/delete-task/${taskId}`);
      fetchTasksByEmail(selectedEmail); // Refresh task list
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };
  const handleEditClick = (task) => {
    setEditingTask(task._id);
    setEditForm({
      taskTitle: task.taskTitle,
      taskDescription: task.taskDescription,
      dueDate: task.dueDate.split("T")[0], // Format to yyyy-mm-dd
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveTaskEdits = async () => {
    try {
      await axios.put(`http://localhost:5010/api/update-task/${editingTask}`, editForm);
      setEditingTask(null); // Close the form
      fetchTasksByEmail(selectedEmail); // Refresh tasks
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };
  
  return (
    <div className='Taskspage'>
      <AdminSidebar />

      <div>
        <h2>Select User Email to See All Tasks</h2>

        <div>
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
          >
            <option value="">-- Select Email --</option>
            {emails.map((user, index) => (
              <option key={index} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>

          {selectedEmail && (
            <button
              onClick={() => {
                setSelectedEmail("");
                setTasks([]);
              }}
            >
              Clear Selection
            </button>
          )}
        </div>

        <div>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length > 0 ? (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task Title</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Edit Date</th>
                    <th>Assigned Date</th>
                    <th>Due Date</th>
                    <th>Completed Date</th>
                    <th>Mark Completed</th>
                    <th>Delete</th> {/* New Column */}
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={task._id}>
                      <td>{index + 1}</td>
                      <td>{task.status}</td>
                      <td>
  {editingTask === task._id ? (
    <input
      name="taskTitle"
      value={editForm.taskTitle}
      onChange={handleEditChange}
    />
  ) : (
    task.taskTitle
  )}
</td>

<td>
  {editingTask === task._id ? (
    <input
      name="taskDescription"
      value={editForm.taskDescription}
      onChange={handleEditChange}
    />
  ) : (
    task.taskDescription
  )}
</td>

<td>
  {editingTask === task._id ? (
    <input
      type="date"
      name="dueDate"
      value={editForm.dueDate}
      onChange={handleEditChange}
    />
  ) : (
    new Date(task.dueDate).toLocaleDateString()
  )}
</td>
                      <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td>
  {task.status === "Completed" && task.completedAt
    ? new Date(task.completedAt).toLocaleDateString()
    : "--"}
</td>                      
                      <td>
                       <button className='taskcontrol'
  onClick={() => toggleTaskStatus(task._id, task.status)}
>
  {task.status === "Completed" ? "Mark Pending" : "Mark Completed"}
</button>
                      </td>
                      <td>
        <button
          className='taskcontrol delete-btn'
          onClick={() => deleteTask(task._id)}
        >
          Delete
        </button>
      </td>
      <td>
  {editingTask === task._id ? (
    <button className='taskcontrol' onClick={saveTaskEdits}>Save</button>
  ) : (
    <button className='taskcontrol' onClick={() => handleEditClick(task)}>Edit</button>
  )}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : selectedEmail ? (
            <p>No tasks found for this email.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}