import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../UserComponents/Sidebar";
import "../styles/EmployeeDashboard.css";
import AttendanceCharts from "../UserComponents/AttendanceCharts";
import AttendanceCalendar from "../UserComponents/AttendanceCalendar";
// ✅ Define this function **before** using it
import moment from 'moment-timezone';


export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);


  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const employeeEmail = user?.email;

    if (!token || !employeeEmail) {
      navigate("/login");
      return;
    }

    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get("http://localhost:5010/api/employees", {
          params: { email: employeeEmail },
          headers: { Authorization: `Bearer ${token}` },
        });

        setEmployeeData(response.data);

        // ✅ Fetch Full Attendance History
        const attendanceResponse = await axios.get(
          "http://localhost:5010/api/attendance/history",
          {
            params: { email: employeeEmail },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Convert Data to { "YYYY-MM-DD": "present" / "absent" }
        const formattedAttendance = {};
        attendanceResponse.data.forEach((record) => {
          formattedAttendance[record.date] = record.isPresent ? "present" : "absent";
        });

        setAttendanceData(formattedAttendance);

        // ✅ Check today's attendance
        const today = new Date().toISOString().split("T")[0];
        if (formattedAttendance[today] === "present") {
          setIsAttendanceMarked(true);
        }

      } catch (err) {
        setError("Failed to fetch employee or attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [navigate]);


  const openCamera = async () => {

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Use front camera
      });
  
      streamRef.current = stream; // Store stream reference
  
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play(); // Ensure video plays
      }
  
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access is required to mark attendance.");
    }

  };

  
  // Ensure Video Updates When Camera Opens
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play();
    }
  }, [isCameraOpen]);

    

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
  
      // Reduce canvas resolution (lower resolution means lower file size)
      const width = 300;
      const height = 200;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      context.drawImage(videoRef.current, 0, 0, width, height);
  
      // Convert to Data URL (initial capture, high quality)
      const initialImage = canvasRef.current.toDataURL("image/jpeg", 1.0); // High quality (1.0)
  
      // ✅ Compress Image AFTER Capturing
      compressImage(initialImage, (compressedDataUrl) => {
        setCapturedImage(compressedDataUrl);
      });
  
      // ✅ Stop Camera Stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };
  
  // ✅ Compress Image Function
  const compressImage = (imageDataUrl, callback) => {
    const img = new Image();
    img.src = imageDataUrl;
  
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      // Set new resolution for compression
      const width = 200; // Lower resolution
      const height = 150; // Lower resolution
      canvas.width = width;
      canvas.height = height;
  
      ctx.drawImage(img, 0, 0, width, height);
  
      // Convert to compressed JPEG (lower quality)
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.4); // Lower quality (0.4)
  
      callback(compressedDataUrl);
    };
  };

  // const uploadAttendance = async () => {
  //   if (!capturedImage || !employeeData) {
  //     alert("No image captured or employee data missing!");
  //     return;
  //   }
  
  //   try {
  //     await axios.post("http://localhost:5010/api/attendance/mark", {
  //       email: employeeData.email,
  //       employeeId: employeeData._id,
  //       image: capturedImage,
        
  //     });
  
  //     alert("✅ Attendance marked successfully!");
  //     setIsCameraOpen(false);
  //     setCapturedImage(null);
  //     setIsAttendanceMarked(true); // Disable attendance marking after success
  //   } catch (error) {
  //     console.error("Error uploading attendance:", error);
  //     alert("❌ Failed to upload attendance.");
  //   }
  // };
  // // ✅ Format Date Correctly for Display

  const uploadAttendance = async () => {
    if (!capturedImage || !employeeData) {
      alert("No image captured or employee data missing!");
      return;
    }
  
    // ✅ Get current IST date and time using moment-timezone
    const istDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    const istTime = moment().tz('Asia/Kolkata').format('HH:mm:ss');
  
    try {
      await axios.post("http://localhost:5010/api/attendance/mark", {
        email: employeeData.email,
        employeeId: employeeData._id,
        image: capturedImage,
        date: istDate,  // ✅ "2023-10-05"
        time: istTime,  // ✅ "14:30:00"
      });
  
      alert("✅ Attendance marked successfully!");
      setIsCameraOpen(false);
      setCapturedImage(null);
      setIsAttendanceMarked(true);
    } catch (error) {
      console.error("Error uploading attendance:", error);
      alert("❌ Failed to upload attendance.");
    }
  };


  const formatLocalDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" }); // Change timeZone as needed
};

const formatLocalTime = (timeString) => {
  if (!timeString) return "N/A";
  return new Date("1970-01-01T" + timeString + "Z").toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour12: false });
};

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        {loading && <p>Loading employee data...</p>}
        {error && <p>Error: {error}</p>}

        {employeeData && (
          <div className="employee-data">
            <h3><strong>Welcome </strong> {employeeData.fullName}</h3>
            <p>Today's Date: {formatLocalDate(new Date().toISOString().split("T")[0])}</p>
         
          </div>
        )}

        <div className="attendance-section">
          <h2>Mark Your Attendance Today</h2>
          {!isCameraOpen ? (
            <button 
  className="mark-attendance-btn" 
  onClick={openCamera} 
  disabled={isAttendanceMarked}
>
  {isAttendanceMarked ? "✅ Attendance Marked" : "Mark Attendance"}
</button>
          ) : (
            <div className="camera-container">
              <video ref={videoRef} autoPlay width="300" height="200"></video>
              <canvas ref={canvasRef} width="300" height="200" style={{ display: "none" }}></canvas>

              {!capturedImage ? (
                <button onClick={captureImage}>📸 Capture</button>
              ) : (
                <>
                  {/* <img src={capturedImage} alt="Captured" width="300" height="800" /> */}
                  <img src={capturedImage} alt="Captured" className="captured-image" />
                  <button onClick={uploadAttendance}>⬆️ Upload</button>
                </>
              )}
            </div>
          )}
        </div>
        <div>
        <AttendanceCalendar/>
        <AttendanceCharts/>
      
        </div>
      </div>
    </div>
  );
}
