// import React, { useEffect, useState } from "react";
// import UserNavbar from "../Components/UserNavbar"; // Import UserNavbar component
// import Calendar from 'react-calendar'; // Import react-calendar package
// import 'react-calendar/dist/Calendar.css'; // Import calendar styles
// import '../styles/Home.css'

// const UserDashboard = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [markedToday, setMarkedToday] = useState(false);
//   const [dateValue, setDateValue] = useState(new Date()); // State to handle selected date
//   const [loading, setLoading] = useState(true);
//   const [userEmail, setUserEmail] = useState(null); // State to hold user email

//   useEffect(() => {
//     // Get the JWT token from localStorage
//     const token = localStorage.getItem("authToken");

//     if (token) {
//       // Fetch the user data from the backend using the token
//       const fetchUserData = async () => {
//         try {
//           const response = await fetch("https://yourbackend.com/api/user", {
//             method: "GET",
//             headers: {
//               "Authorization": `Bearer ${token}`, // Send the token in the Authorization header
//             },
//           });

//           const data = await response.json();

//           if (data.email) {
//             setUserEmail(data.email); // Set the email in state if available
//           } else {
//             console.log("No email found in the response");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       };

//       fetchUserData();
//     } else {
//       console.log("No token found in localStorage");
//     }

//     // Simulate fetching attendance data for the current month from the server
//     const fetchAttendanceData = async () => {
//       const mockAttendance = [
//         { date: '2025-01-03', status: 'Present' },
//         { date: '2025-01-02', status: 'Absent' },
//         { date: '2025-01-22', status: 'Present' },
//         { date: '2025-02-01', status: 'Present' },
//         { date: '2025-02-02', status: 'Absent' },
//         { date: '2025-02-10', status: 'Present' },
//       ];

//       setAttendance(mockAttendance);
//       setLoading(false);
//     };

//     fetchAttendanceData();
//   }, []);

//   const markAttendance = () => {
//     const today = new Date().toISOString().split("T")[0];
//     const newAttendanceRecord = { date: today, status: "Present" };

//     setAttendance([...attendance, newAttendanceRecord]);
//     setMarkedToday(true);
//   };

//   const getDayStatus = (date) => {
//     const formattedDate = date.toISOString().split("T")[0];
//     const record = attendance.find((att) => att.date === formattedDate);
//     return record ? record.status : null;
//   };

//   const tileClassName = ({ date, view }) => {
//     if (view === 'month') {
//       const status = getDayStatus(date);
//       if (status === "Present") {
//         return "present";
//       } else if (status === "Absent") {
//         return "absent";
//       }
//     }
//   };

//   const calculateMonthlyAttendance = () => {
//     const monthlyAttendance = {};

//     attendance.forEach((entry) => {
//       const monthYear = entry.date.slice(0, 7); 
//       if (!monthlyAttendance[monthYear]) {
//         monthlyAttendance[monthYear] = { present: 0, absent: 0 };
//       }

//       if (entry.status === 'Present') {
//         monthlyAttendance[monthYear].present += 1;
//       } else {
//         monthlyAttendance[monthYear].absent += 1;
//       }
//     });

//     return monthlyAttendance;
//   };

//   const monthlyAttendance = calculateMonthlyAttendance();

//   if (loading) return <h2 className="text-center">Loading...</h2>;

//   return (
//     <div>
//       <UserNavbar />
//       <div className="container my-5">
//         <h2 className="text-center">User Dashboard</h2>

//         {/* Display User Email */}
//         {userEmail ? (
//           <p className="text-center">Welcome, {userEmail}</p>
//         ) : (
//           <p className="text-center">Welcome, Guest</p>
//         )}

//         {/* Mark Attendance Button */}
//         <button 
//           className="btn btn-success mb-3"
//           onClick={markAttendance}
//           disabled={markedToday}
//         >
//           {markedToday ? "Attendance Marked for Today ✅" : "Mark Your Attendance for Today"}
//         </button>

//         {/* Calendar Display */}
//         <h3 className="text-center mt-4">Attendance Calendar for January 2025</h3>
//         <Calendar
//           value={dateValue}
//           onChange={setDateValue}
//           tileClassName={tileClassName}
//         />

//         {/* Monthly Attendance Table */}
//         <h3 className="text-center mt-4">Monthly Attendance Summary</h3>
//         <table className="table table-bordered mt-3">
//           <thead>
//             <tr>
//               <th>Month</th>
//               <th>Present</th>
//               <th>Absent</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.keys(monthlyAttendance).map((monthYear) => (
//               <tr key={monthYear}>
//                 <td>{monthYear}</td>
//                 <td>{monthlyAttendance[monthYear].present}</td>
//                 <td>{monthlyAttendance[monthYear].absent}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;