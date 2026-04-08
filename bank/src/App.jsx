import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminLoans from "./pages/admin/AdminLoans";
import AdminAgentDetails from "./pages/admin/AdminAgentDetails";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminLoanDetails from "./pages/admin/AdminLoanDetails";

import AgentLogin from "./pages/AgentLogin";
import AgentLayout from "./layouts/AgentLayout";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentUsers from "./pages/agent/AgentUsers";
import AgentLoans from "./pages/agent/AgentLoans";
import LoanProcess from "./pages/agent/LoanProcess";
import AgentProfile from "./pages/agent/AgentProfile";
import AgentUserDetails from "./pages/agent/AgentUserDetails";

import Login from "./pages/Login";
import Home from "./pages/user/Home";
import Loans from "./pages/user/Loans";
import LoanDetails from "./pages/user/LoanDetails";
import ApplyLoan from "./pages/user/ApplyLoan";

import UserHome from "./pages/user/UserHome";
import MyApplications from "./pages/user/MyApplications";
import MyLoanDetails from "./pages/user/MyLoanDetails";
import Documents from "./pages/user/Documents";
import Support from "./pages/user/Support";
import Profile from "./pages/user/Profile";
import EditProfile from "./pages/user/EditProfile";
import LoanSuccess from "./pages/user/LoanSuccess";
import EditLoan from "./pages/user/EditLoan";
import UserLayout from "./layouts/UserLayout";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/loans/:type" element={<LoanDetails />} />

        {/* Admin Login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Agent Login */}
        <Route path="/agent-login" element={<AgentLogin />} />

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
          <Route path="agents/:id" element={<AdminAgentDetails />} />
          <Route path="loans" element={<AdminLoans />} />
          <Route path="loans/:loanId" element={<AdminLoanDetails />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Agent Routes */}
        <Route
          path="/agent"
          element={
            <ProtectedRoute role="agent">
              <AgentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="users" element={<AgentUsers />} />
          <Route path="users/:id" element={<AgentUserDetails />} />
          <Route path="loans" element={<AgentLoans />} />
          <Route path="loans/:loanId" element={<LoanProcess />} />
          <Route path="profile" element={<AgentProfile />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserHome />} />
          <Route path="apply-loan" element={<ApplyLoan />} />
          <Route path="my-applications" element={<MyApplications />} />
          <Route path="my-applications/:loanId" element={<MyLoanDetails />} />
          <Route path="my-applications/:loanId/edit" element={<EditLoan />} />
          <Route path="documents" element={<Documents />} />
          <Route path="loans/:type" element={<LoanDetails />} />
          <Route path="support" element={<Support />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="loan-success" element={<LoanSuccess />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;