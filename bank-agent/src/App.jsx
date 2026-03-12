import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AgentLayout from "./layouts/AgentLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentUsers from "./pages/agent/AgentUsers";
import AgentLoans from "./pages/agent/AgentLoans";
import LoanProcess from "./pages/agent/LoanProcess";
import AgentProfile from "./pages/agent/AgentProfile";
import AgentUserDetails from "./pages/agent/AgentUserDetails";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

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


      </Routes>
    </BrowserRouter>
  );
}

export default App;