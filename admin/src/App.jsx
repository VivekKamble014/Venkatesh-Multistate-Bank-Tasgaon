import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminValidation from "./pages/AdminValidation";
import AdminDashboard from "./pages/AdminDashboard";
import Sidebar from "./componants/Sidebar";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin-validation" element={<AdminValidation />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Sidebar" element={<Sidebar />} />
      </Routes>
    </Router>
  );
}

export default App;