import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css"; // Import custom styles

export default function AttendanceCalendar() {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const employeeEmail = localStorage.getItem("userEmail");
  useEffect(() => {
    const fetchAttendance = async () => {
        if (!employeeEmail) return;
        try {
            const response = await axios.get("http://localhost:5010/api/attendance/calender", {
                params: { email: employeeEmail },
            });

            console.log("📊 API Response:", response.data.attendance); // Debugging

            const data = response.data.attendance || [];

            const formattedData = data.reduce((acc, record) => {
                const formattedDate = new Date(record.date).toDateString();
                acc[formattedDate] = record.isPresent.trim(); // Ensuring no whitespace issues
                return acc;
            }, {});

            console.log("✅ Formatted Data:", formattedData); // Check if Absent is stored correctly

            setAttendanceData(formattedData);
        } catch (error) {
            console.error("❌ Error fetching attendance data:", error);
        }
    };

    fetchAttendance();
}, [employeeEmail]);


const tileClassName = ({ date }) => {
    const dateString = date.toDateString();
    const status = attendanceData[dateString];


    if (status === "Present") {
        return "present-day";  // ✅ Green for present
    } else if (status === "Absent") {
        return "absent-day";  // ❌ Red for absent
    }

    return "";
};
  if (!employeeEmail) return <p className="error-message">⚠️ Please log in to view attendance data.</p>;

  return (
    <div className="calendar-wrapper">
      <div className="calendar-container">
        <h3>Attendance Calendar</h3>
        <Calendar
    onChange={setSelectedDate}
    value={selectedDate}
    tileClassName={tileClassName} // ✅ Make sure this is included
/>
        {/* <div className="legend">
          <span className="legend-item present">✔ Present</span>
          <span className="legend-item absent">✖ Absent</span>
        </div> */}
      </div>
    </div>
  );
}