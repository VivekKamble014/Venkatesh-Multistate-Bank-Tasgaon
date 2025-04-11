import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SearchEmployee.css";

export default function SearchEmployee({ onSearch }) {
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [selectedBranch, setSelectedBranch] = useState("Venkatesh Multistate Tasgaon");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get("http://localhost:5010/users/filters");
        setBranches(response.data.branches);
        setDepartments(response.data.departments);
        setJobRoles(response.data.jobRoles);
      } catch (error) {
        console.error("Error fetching filters", error);
      }
    };
    fetchFilters();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:5010/users/search", {
        params: {
          branch: selectedBranch,
          department: selectedDepartment,
          jobRole: selectedJobRole,
          employee: selectedEmployee
        }
      });
      onSearch(response.data);
    } catch (error) {
      console.error("Error searching employees", error);
    }
  };

  return (
    <div className="search-employee-container">
      <h2>Search Employee</h2>
      <div className="search-fields">
        <label>Branch:</label>
        <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
          <option value="Venkatesh Multistate Tasgaon">Venkatesh Multistate Tasgaon</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>{branch}</option>
          ))}
        </select>

        <label>Department:</label>
        <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          <option value="">Select Department</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>

        <label>Job Role:</label>
        <select value={selectedJobRole} onChange={(e) => setSelectedJobRole(e.target.value)}>
          <option value="">Select Job Role</option>
          {jobRoles.map((role, index) => (
            <option key={index} value={role}>{role}</option>
          ))}
        </select>

        <label>Employee:</label>
        <input 
          type="text" 
          placeholder="Enter employee name" 
          value={selectedEmployee} 
          onChange={(e) => setSelectedEmployee(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
}