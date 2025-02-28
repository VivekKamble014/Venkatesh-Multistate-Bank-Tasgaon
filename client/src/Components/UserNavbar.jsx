// // UserNavbar.js
// import React from "react";
// import { useNavigate } from "react-router-dom"; // For redirecting after logout

// const UserNavbar = () => {
//   const navigate = useNavigate();

//   const logout = () => {
//     // Clear token from localStorage
//     localStorage.removeItem("token");

//     // Redirect to login page
//     navigate("/login");
//   };

//   const navigateToAttendance = () => {
//     navigate("/attendance");
//   };

//   const navigateToProfile = () => {
//     navigate("/profile");
//   };

//   return (
//     <nav className="navbar navbar-light bg-light">
//       <div className="container-fluid">
//         <button className="btn btn-danger" onClick={logout}>
//           Logout
//         </button>
//         <button className="btn btn-primary ms-3" onClick={navigateToAttendance}>
//           Attendance
//         </button>
//         <button className="btn btn-info ms-3" onClick={navigateToProfile}>
//           Profile
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default UserNavbar;