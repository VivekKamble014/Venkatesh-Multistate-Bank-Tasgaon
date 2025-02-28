import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployeePersonalDetails from "./pages/EmployeePersonalDetails";
import EmployeeProfessionalDetails from "./pages/EmployeeProfessionalDetails";
import Services from "./pages/Services";
import EmployeeDashboard from "./pages/EmployeeDashboard";



import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Loader from "./Components/Loader";
import Sidebar from "./Components/Sidebar";



// Layout component to conditionally hide Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Pages where Navbar and Footer should be hidden
  const hideLayoutPages = [
    "/EmployeePersonalDetails",
    "/EmployeeProfessionalDetails",
    "/Sidebar",
    "/EmployeeDashboard"
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
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Services" element={<Services />} />
          <Route path="/EmployeePersonalDetails" element={<EmployeePersonalDetails />} />
          <Route path="/EmployeeProfessionalDetails" element={<EmployeeProfessionalDetails />} />
          <Route path="/Sidebar" element={<Sidebar />} />
          <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;