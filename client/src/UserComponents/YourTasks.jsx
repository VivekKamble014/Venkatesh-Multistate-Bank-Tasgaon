import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../styles/YourTasks.css";

export default function YourTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const { email } = JSON.parse(storedUser);

      axios
        .get("http://localhost:5010/api/by-email", {
          params: { email },
        })
        .then((res) => setTasks(res.data))
        .catch((err) => console.error("Error fetching tasks:", err));
    }
  }, []);

  // ✅ Properly placed async function
  const toggleTaskStatus = async (id) => {
    const taskToUpdate = tasks.find((task) => task._id === id);
    const newStatus = taskToUpdate.status === "Pending" ? "Completed" : "Pending";

    try {
      const res = await axios.put(`http://localhost:5010/api//updatetask/${id}`, {
        status: newStatus,
        completedAt: newStatus === "Completed" ? new Date() : null,

      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  const generateTaskSummary = () => {
    const summary = {};

    tasks.forEach((task) => {
      const date = task.createdAt?.split("T")[0];
      if (!summary[date]) {
        summary[date] = { total: 0, completed: 0, pending: 0 };
      }
      summary[date].total++;
      if (task.status === "Completed") {
        summary[date].completed++;
      } else {
        summary[date].pending++;
      }
    });

    return Object.entries(summary).map(([date, data], index) => ({
      srNo: index + 1,
      date,
      totalTasks: data.total,
      completedTasks: data.completed,
      pendingTasks: data.pending,
    }));
  };

  return (
    <div className="tasks-container">
      <Sidebar />

      <div className="tasks-content">
        <h2>Task Manager</h2>

        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul className="task-list">
  {[...tasks]
    .sort((a, b) => (a.status === "Completed" ? 1 : -1)) // move completed to bottom
    .map((task) => {
      const createdDate = new Date(task.createdAt).toLocaleDateString();
      const dueDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString()
        : "N/A";

      return (
        <li key={task._id} className={`task-item ${task.status.toLowerCase()}`}>
          <div className="task-info">
            <h3 className="task-title">{task.taskTitle}</h3>
            <p className="task-description">{task.taskDescription}</p>
          </div>
          <div className="task-dates">
            <p>
              <strong>Created:</strong> {createdDate}
            </p>
            <p>
              <strong>Due:</strong> {dueDate}
            </p>
          </div>
          {task.completedAt && (
  <p>
    <strong>Completed:</strong>{" "}
    {new Date(task.completedAt).toLocaleDateString()}
  </p>
)}
          <div className="task-actions">
            <button
              className="task-btn completed"
              onClick={() => toggleTaskStatus(task._id)}
              disabled={task.status === "Completed"}
            >
              ✅ Mark as Complete
            </button>
            <button
              className="task-btn pending"
              onClick={() => toggleTaskStatus(task._id)}
              disabled={task.status === "Pending"}
            >
              ❌ Mark Not Done
            </button>
          </div>
        </li>
      );
    })}
</ul>
        )}
      </div>
    </div>
  );
}