import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminLoans from "./pages/admin/AdminLoans";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminAgentDetails from "./pages/admin/AdminAgentDetails";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminLoanDetails from "./pages/admin/AdminLoanDetails";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="agents" element={<AdminAgents />} />
          <Route path="loans" element={<AdminLoans />} />
          <Route path="agents/:id" element={<AdminAgentDetails />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="loans/:loanId" element={<AdminLoanDetails />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
