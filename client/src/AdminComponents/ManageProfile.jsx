import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "../AdminComponents/AdminSidebar";
import "../styles/ManageProfile.css";

export default function ManageProfile() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search query state
  const usersPerPage = 10; // Show only 10 users per page

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("http://localhost:5010/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch profiles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // ✅ Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Get the data for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // ✅ Handle Next & Previous
  const nextPage = () => {
    if (indexOfLastUser < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ✅ Handle Admin Change
  const handleRoleChange = async (id, isAdmin) => {
    try {
      await axios.put(`http://localhost:5010/users/${id}/update-role`, { isAdmin });
      setUsers(users.map(user => user._id === id ? { ...user, isAdmin } : user));
      alert(`User is now ${isAdmin ? "Admin" : "User"}`);
    } catch (err) {
      alert("Failed to update role");
    }
  };

  // ✅ Delete Profile
  const deleteProfile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      await axios.delete(`http://localhost:5010/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      alert("Failed to delete profile");
    }
  };

  const toggleBlockProfile = async (id, currentStatus) => {
    const action = currentStatus ? "block" : "unblock";
    try {
      await axios.put(`http://localhost:5010/users/${id}/${action}`);
      setUsers(users.map(user =>
        user._id === id ? { ...user, isVerified: !currentStatus } : user
      ));
      alert(`User has been ${currentStatus ? "blocked" : "unblocked"}`);
    } catch (err) {
      alert(`Failed to ${action} profile`);
    }
  };

  return (
    <div className="manage-profile-container">
      <AdminSideBar />
      <h2>Manage User Profiles</h2>

      {/* ✅ Search Input */}
      <input 
        type="text" 
        placeholder="Search by name..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        className="search-input"
      />

      {loading && <p>Loading profiles...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && currentUsers.length > 0 ? (
        <>
        <div className="profile-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Job Role</th>
                <th>Joining Date</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Profile Updated</th>
                <th>Make Admin</th>
                <th>Delete</th>
                <th>Edit</th>
                <th>Block</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>{user.fullName || "N/A"}</td> 
                  <td>{user.email}</td>
                  <td>{user.department || "N/A"}</td>
                  <td>{user.jobRole || "N/A"}</td>
                  <td>{user.joinDate || "N/A"}</td>
                  <td>
                    <select
                      value={user.isAdmin ? "admin" : "user"}
                      onChange={(e) => handleRoleChange(user._id, e.target.value === "admin")}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{user.isVerified ? "Yes" : "No"}</td>
                  <td>{user.profileUpdate ? "Yes" : "No"}</td>
                  <td><button onClick={() => handleRoleChange(user._id, true)} disabled={user.isAdmin}>Make Admin</button></td>
                  <td><button onClick={() => deleteProfile(user._id)} className="delete-btn">Delete</button></td>
                  <td><button className="edit-btn">Edit</button></td>
                  <td><button
    onClick={() => toggleBlockProfile(user._id, user.isVerified)}
    className="block-btn"
  >
    {user.isVerified ? "Block" : "Unblock"}
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Prev
            </button>
            <span>Page {currentPage}</span>
            <button onClick={nextPage} disabled={indexOfLastUser >= filteredUsers.length}>
              Next
            </button>
          </div>
        </>
      ) : (
        !loading && <p>No profiles found.</p>
      )}
    </div>
  );
}
