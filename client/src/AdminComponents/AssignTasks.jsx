import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from "./AdminSidebar";
import "../styles/AssignTasks.css";
import { useNavigate } from 'react-router-dom';
const departments = ["Customer Service", "Loans", "Accounts", "Finance", "IT", "HR", "Operations"];

const jobRolesByDepartment = {
  "Customer Service": ["Customer Service Representative", "Branch Relationship Manager", "Teller"],
  "Loans": ["Loan Officer", "Credit Analyst", "Loan Processing Specialist", "Branch Manager", "Sales Executive"],
  "Accounts": ["Account Manager", "Account Assistant", "Reconciliation Specialist"],
  "Finance": ["Bank Auditor", "Financial Analyst", "Treasury Manager"],
  "IT": ["Core Banking System Administrator", "Software Developer", "IT Support Technician"],
  "HR": ["HR Executive", "Recruiter", "Payroll Officer"],
  "Operations": ["Operations Manager", "Compliance Officer", "Risk Analyst"]
};

const AssignTasks = () => {
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate(); // ✅ Make sure this is inside the component
  const fetchEmployees = () => {
    if (selectedRole) {
      setLoading(true);
      setFetchError('');
      axios.get(`http://localhost:5010/api/get-employee?role=${encodeURIComponent(selectedRole)}`)
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : [];
          setEmployees(data);
        })
        .catch(err => {
          console.error('Error fetching employees:', err);
          setFetchError("Failed to fetch employees.");
        })
        .finally(() => setLoading(false));
    }
  };

  const fetchAllEmployees = () => {
    setLoading(true);
    setFetchError('');
    axios.get('http://localhost:5010/api/get-all-employees')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setEmployees(data);
        setSelectedDept('');
        setSelectedRole('');
      })
      .catch(err => {
        console.error('Error fetching all employees:', err);
        setFetchError("Failed to fetch all employees.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmployees();
  }, [selectedRole]);



  const handleAssignTask = (employee) => {
    navigate('/AddTask', { state: { employee } });
  };

  const handleSort = (key) => {
    const newOrder = (sortBy === key && sortOrder === 'asc') ? 'desc' : 'asc';
    const sorted = [...employees].sort((a, b) => {
      const aVal = (a[key] || '').toString().toLowerCase();
      const bVal = (b[key] || '').toString().toLowerCase();
      if (aVal < bVal) return newOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return newOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setSortBy(key);
    setSortOrder(newOrder);
    setEmployees(sorted);
  };

  const handleRefresh = () => {
    if (selectedRole) {
      fetchEmployees();
    } else {
      fetchAllEmployees();
    }
  };

  return (
    <div className="maindiv">
      <AdminSidebar />

      <div className="content">
        <h2>Find Employees by Role</h2>

        {employees.length > 0 && (
          <div className="sortbuttons">
            <button onClick={() => handleSort('employeeID')}>🔢 Sort by ID</button>
            <button onClick={() => handleSort('fullName')}>🔤 Sort by Name</button>
            <button onClick={handleRefresh}>🔄 Refresh</button>
            <button onClick={fetchAllEmployees}>👥 Show All Employees</button>
          </div>
        )}

        <div className="form-group">
          <label>Select Department</label>
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setSelectedRole('');
              setEmployees([]);
              setFetchError('');
            }}
          >
            <option value="">-- Choose Department --</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {selectedDept && (
          <div className="form-group">
            <label>Select Job Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">-- Choose Job Role --</option>
              {(jobRolesByDepartment[selectedDept] || []).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        )}

        {loading && <p className="loading">Loading employees...</p>}
        {fetchError && <p className="error">{fetchError}</p>}

        {!loading && employees.length > 0 && (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Job Role</th>
                  <th>Employee ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{index + 1}</td>
                    <td>{emp.fullName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.jobRole}</td>
                    <td>{emp.employeeID}</td>
                    <td>
                      <button
                        className="assign-btn"
                        onClick={() => handleAssignTask(emp)}
                      >
                        Assign Task
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && selectedRole && employees.length === 0 && (
          <p className="empty-message">No employees found for this role.</p>
        )}
      </div>
    </div>
  );
};

export default AssignTasks;