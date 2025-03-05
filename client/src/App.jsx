import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { RegistrationProvider } from "./context/RegistrationContext";




import Home from "./pages/Home";
import Login from "./pages/Login";
import Services from "./pages/Services";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import Signup from "./pages/SignupForm";
import Profile from "./pages/Profile";
import YourProgress from "./pages/YourProgress";
import YourTasks from "./pages/YourTasks";
import Notification from "./pages/Notification";

import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Loader from "./Components/Loader";
import Sidebar from "./Components/Sidebar";
import VerifyEmail from "./pages/VerifyEmail";
import EmployeeDetails from "./pages/EmployeeDetails";


// Layout component to conditionally hide Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Pages where Navbar and Footer should be hidden
  const hideLayoutPages = [
    "/Sidebar",
    "/EmployeeDashboard",
    "/signup",
    "/EmployeeDetails",
    "/Profile",
    "/YourProgress",
    "/YourTasks",
    "/Notification"
  ];

  const hideLayout = hideLayoutPages.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
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

  
          <Route path="/signup" element={<Signup />} />
          <Route path="/VerifyEmail" element={<VerifyEmail />} />
          <Route path="/EmployeeDetails" element={<EmployeeDetails />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/YourTasks" element={<YourTasks />} />
          <Route path="/YourProgress" element={<YourProgress />} />
          <Route path="/Notification" element={<Notification />} />

        </Routes>
      </Layout>
    </Router>
          </RegistrationProvider>
  );
}

export default App;