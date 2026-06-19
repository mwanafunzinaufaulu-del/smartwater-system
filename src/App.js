import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import ReportIssue from "./pages/ReportIssue";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/technician" element={<TechnicianDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
