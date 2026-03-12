import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/loans/:type" element={<LoanDetails />} />
        
        

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
          <Route path="documents" element={<Documents />} />
          <Route path="loans/:type" element={<LoanDetails />} />
          <Route path="support" element={<Support />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="loan-success" element={<LoanSuccess />} />
          <Route path="my-applications/:loanId/edit" element={<EditLoan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;