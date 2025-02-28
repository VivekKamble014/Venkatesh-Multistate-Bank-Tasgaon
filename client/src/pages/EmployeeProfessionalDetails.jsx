import React, { useState } from "react";
import "../styles/EmployeeProfessionalDetails.css";

export default function EmployeeProfessionalDetails() {
  const [department, setDepartment] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [showVehicleOwnership, setShowVehicleOwnership] = useState(false);

  const jobRoles = {
    Loan: ["Loan Officer", "Loan Assistant"],
    Finance: ["Accountant", "Finance Manager"],
    Recovery: ["Recovery Agent", "Field Collector"],
  };

  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    setDepartment(selectedDept);
    setJobRole(""); // Reset job role when department changes
    setShowVehicleOwnership(false); // Reset vehicle ownership when department changes
  };

  const handleJobRoleChange = (e) => {
    const selectedRole = e.target.value;
    setJobRole(selectedRole);
    setShowVehicleOwnership(selectedRole === "Recovery Agent"); // Show only if Recovery Agent is selected
  };

  return (
    <div className="EmpProfeDet">
    <div className="form-container">
      <h2 className="form-title">Employee Professional Details</h2>
      <form>
        {/* Branch Name */}
        <div className="form-group">
          <label htmlFor="branch">Branch Name</label>
          <select id="branch" disabled>
            <option>Venkatesh Multistate Bank Tasgaon</option>
          </select>
        </div>

        {/* Department */}
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select id="department" value={department} onChange={handleDepartmentChange} required>
            <option value="">Select Department</option>
            <option value="Loan">Loan</option>
            <option value="Finance">Finance</option>
            <option value="Recovery">Recovery</option>
          </select>
        </div>

        {/* Job Role */}
        <div className="form-group">
          <label htmlFor="jobRole">Job Role</label>
          <select id="jobRole" value={jobRole} onChange={handleJobRoleChange} required>
            <option value="">Select Job Role</option>
            {department && jobRoles[department].map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Vehicle Ownership (Conditional) */}
        {showVehicleOwnership && (
          <div className="form-group">
            <label>Vehicle Ownership</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="vehicleOwnership" value="Yes" required /> Yes
              </label>
              <label>
                <input type="radio" name="vehicleOwnership" value="No" required /> No
              </label>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button type="submit" className="submit-btn">Save</button>
      </form>
    </div>
    </div>
  );
}