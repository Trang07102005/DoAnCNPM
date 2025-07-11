import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import StaffDashboard from "./pages/Staff/StaffDashboard";
import CashierDashboard from "./pages/Cashier/CashierDashboard";
import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import ChefDashboard from "./pages/Chef/ChefDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminNavbar from "./components/navbar/AdminNavbar";
import StaffNavbar from "./components/navbar/StaffNavbar";
import CashierNavbar from "./components/navbar/CashierNavbar";
import ManagerNavbar from "./components/navbar/ManagerNavbar";
import ChefNavbar from "./components/navbar/ChefNavbar";
import KitchenDashboard from "./pages/Chef/KitchenDashboard";


import { ToastContainer } from "react-toastify";        
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setRole("");
  };
  const getNavbar = () => {
    const commonProps = { onLogout: handleLogout };

    switch (role) {
      case "Admin":
        return <AdminNavbar {...commonProps} />;
      case "Staff":
        return <StaffNavbar {...commonProps} />;
      case "Cashier":
        return <CashierNavbar {...commonProps} />;
      case "Manager":
        return <ManagerNavbar {...commonProps} />;
      case "Chef":
        return <ChefNavbar {...commonProps} />;
      default:
        return <Navbar />;
    }
  };

  return (
    <Router>
      <div className="w-full min-h-screen bg-neutral-100/50 text-neutral-500 flex flex-col">
        {getNavbar()}
        <Routes>
          <Route path="/chef/kitchen" element={
          <ProtectedRoute element={<KitchenDashboard />} allowedRoles={["Chef"]} />
        } />
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Home />} />
          <Route path="/login" element={<Login onLogin={(r) => setRole(r)} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute element={<AdminDashboard />} allowedRoles={["Admin"]} />
          } />
          <Route path="/staff/dashboard" element={
            <ProtectedRoute element={<StaffDashboard />} allowedRoles={["Staff"]} />
          } />
          <Route path="/cashier/dashboard" element={
            <ProtectedRoute element={<CashierDashboard />} allowedRoles={["Cashier"]} />
          } />
          <Route path="/manager/dashboard" element={
            <ProtectedRoute element={<ManagerDashboard />} allowedRoles={["Manager"]} />
          } />
          <Route path="/chef/dashboard" element={
            <ProtectedRoute element={<ChefDashboard />} allowedRoles={["Chef"]} />
          } />
        </Routes>

        {(!role || role === "Customer") && <Footer />}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
