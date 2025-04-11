import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { RegistrationProvider } from "./context/RegistrationContext";




import Home from "./pages/Home";
import Login from "./pages/Login";
import Services from "./pages/Services";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Signup from "./pages/SignupForm";
import EmployeeProfile from "./UserComponents/Profile";
import YourProgress from "./UserComponents/YourProgress";
import YourTasks from "./UserComponents/YourTasks";
import Notifications from "./UserComponents/Notification";

import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Loader from "./Components/Loader";
import Sidebar from "./UserComponents/Sidebar";
import VerifyEmail from "./pages/VerifyEmail";
import EmployeeDetails from "./UserComponents/EmployeeDetails";
import AdminSidebar from "./AdminComponents/AdminSidebar";
import Attendance from "./UserComponents/Attendance";

//Admin

import AdminProfile from "./AdminComponents/AdminProfile";
import AssignTasks from "./AdminComponents/AssignTasks";
import EmployeeProgress from "./AdminComponents/EmployeeProgress";
import ManageProfile from "./AdminComponents/ManageProfile";
import Reports from "./AdminComponents/Reports";
import SendNotification from "./AdminComponents/SendNotification";
import AddTask from "./AdminComponents/AddTask";
import Tasks from "./AdminComponents/Tasks";
import ManageAttandance from "./AdminComponents/ManageAttandance";
import SeeNotifications from "./AdminComponents/SeeNotifications";


// Layout component to conditionally hide Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Pages where Navbar and Footer should be hidden
  const hideLayoutPages = [
    "/Sidebar",
    "/AdminSidebar",
    "/EmployeeDashboard",
    "/Signup",
    "/EmployeeDetails",
    "/EmployeeProfile",
    "/YourProgress",
    "/YourTasks",
    "/Notifications",
    "/AdminDashboard",
    "/Attendance",
    "/AdminProfile",
"/AssignTasks",
"/EmployeeProgress",
"/ManageProfile",
"/Reports",
"/SendNotification",
"/AddTask",
"/Tasks",
"/ManageAttandance",
"/SeeNotifications"
  ];

  const hideLayout = hideLayoutPages.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main>{children}</main>
      {/* {!hideLayout && <Footer />} */}
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
          <RegistrationProvider>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/login" element={<Login />} />

          <Route path="/Sidebar" element={<Sidebar />} />
          <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/AdminSidebar" element={<AdminSidebar />} />

  
          <Route path="/Signup" element={<Signup />} />
          <Route path="/VerifyEmail/:token" element={<VerifyEmail />} />
          <Route path="/EmployeeDetails" element={<EmployeeDetails />} />
          <Route path="/EmployeeProfile" element={<EmployeeProfile />} />
          <Route path="/YourTasks" element={<YourTasks />} />
          <Route path="/YourProgress" element={<YourProgress />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/Attendance" element={<Attendance />} />


<Route path="/AdminProfile" element={<AdminProfile />} />
<Route path="/AssignTasks" element={<AssignTasks />} />
<Route path="/EmployeeProgress" element={<EmployeeProgress />} />
<Route path="/ManageProfile" element={<ManageProfile />} />
<Route path="/Reports" element={<Reports />} />
<Route path="/SendNotification" element={<SendNotification />} />
<Route path="/AddTask" element={<AddTask />} />
<Route path="/Tasks" element={<Tasks />} />
<Route path="/ManageAttandance" element={<ManageAttandance />} />
<Route path="/SeeNotifications" element={<SeeNotifications />} />


        </Routes>
      </Layout>
    </Router>
          </RegistrationProvider>
  );
}

export default App;