import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css"; // Custom styles for present/absent

export default function AttendanceCalendar() {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const employeeEmail = storedUser?.email;

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!employeeEmail) return;
      try {
        const response = await axios.get(
          "http://localhost:5010/api/attendance/calender",
          {
            params: { email: employeeEmail },
          }
        );

        const data = response.data.attendance || [];
        const formattedData = data.reduce((acc, record) => {
          const formattedDate = new Date(record.date).toDateString();
          acc[formattedDate] = record.isPresent.trim();
          return acc;
        }, {});

        setAttendanceData(formattedData);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, [employeeEmail]);

  const tileClassName = ({ date }) => {
    const dateString = date.toDateString();
    const status = attendanceData[dateString];

    if (status === "Present") return "present-day";
    else if (status === "Absent") return "absent-day";
    return null;
  };

  if (!employeeEmail)
    return (
      <p className="error-message">⚠️ Please log in to view attendance.</p>
    );

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
      />
      <div className="legend">
        <span className="legend-item present">✔ Present</span>
        <span className="legend-item absent">✖ Absent</span>
      </div>
    </div>
  );
}