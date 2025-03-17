import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // Import Sidebar component
import "../styles/YourTasks.css"; // Import CSS for styling

export default function YourTasks() {
  // Sample Tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete Bank Report", status: "Pending", date: "2025-03-05" },
    { id: 2, title: "Schedule Employee Meeting", status: "Pending", date: "2025-03-05" },
    { id: 3, title: "Update Attendance Records", status: "Completed", date: "2025-03-05" },
    { id: 4, title: "Submit Financial Audit", status: "Pending", date: "2025-03-06" },
    { id: 5, title: "Review Loan Applications", status: "Completed", date: "2025-03-06" },
  ]);

  // Function to Toggle Task Status
  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "Pending" ? "Completed" : "Pending" }
          : task
      )
    );
  };

  // Function to group tasks by date and calculate totals
  const generateTaskSummary = () => {
    const summary = {};

    tasks.forEach((task) => {
      if (!summary[task.date]) {
        summary[task.date] = { total: 0, completed: 0, pending: 0 };
      }
      summary[task.date].total++;
      if (task.status === "Completed") {
        summary[task.date].completed++;
      } else {
        summary[task.date].pending++;
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
      <Sidebar /> {/* Fixed Sidebar */}

      <div className="tasks-content">
        <h2>Task Manager</h2>

        {/* Task List */}
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={`task-item ${task.status.toLowerCase()}`}>
                <span className="task-title">{task.title}</span>
                <div className="task-actions">
                  <button
                    className="task-btn completed"
                    onClick={() => toggleTaskStatus(task.id)}
                    disabled={task.status === "Completed"}
                  >
                    Completed
                  </button>
                  <button
                    className="task-btn pending"
                    onClick={() => toggleTaskStatus(task.id)}
                    disabled={task.status === "Pending"}
                  >
                    Pending
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Task Summary Table */}
        <h2>Task Summary</h2>
        <table className="task-summary">
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Date</th>
              <th>Total Tasks Assigned</th>
              <th>Completed Tasks</th>
              <th>Pending Tasks</th>
            </tr>
          </thead>
          <tbody>
            {generateTaskSummary().map((row) => (
              <tr key={row.srNo}>
                <td>{row.srNo}</td>
                <td>{row.date}</td>
                <td>{row.totalTasks}</td>
                <td>{row.completedTasks}</td>
                <td>{row.pendingTasks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}