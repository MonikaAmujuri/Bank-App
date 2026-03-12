import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const [stats, setStats] = useState(() => {
  const savedStats = localStorage.getItem("adminDashboardStats");
  return savedStats
    ? JSON.parse(savedStats)
    : {
    users: 0,
    agents: 0,
    loans: 0,
    homeLoans: 0,
    personalLoans: 0,
    educationLoans: 0,
    businessLoans: 0,
    vehicleLoans: 0,
    };
  });

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setStats(data);
localStorage.setItem("adminDashboardStats", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm font-medium">Total Customers</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.users}
          </h2>
        </div>

        <div
          onClick={() => navigate("/admin/agents")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm font-medium">Total Agents</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.agents}
          </h2>
        </div>

        <div
          onClick={() => navigate("/admin/loans")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm font-medium">Total Loans</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.loans}
          </h2>
        </div>
        <div
          onClick={() => navigate("/admin/loans?loanType=home")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm font-medium">Home Loans</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.homeLoans}
          </h2>
        </div>
        <div
          onClick={() => navigate("/admin/loans?loanType=personal")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm font-medium">Personal Loans</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.personalLoans}
          </h2>
        </div>
        <div
          onClick={() => navigate("/admin/loans?loanType=education")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm font-medium">Education Loans</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.educationLoans}
          </h2>
        </div>
        <div
          onClick={() => navigate("/admin/loans?loanType=business")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm font-medium">Business Loans</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.businessLoans}
          </h2>
        </div>
        <div
          onClick={() => navigate("/admin/loans?loanType=vehicle")}
          className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
        >
          <p className="text-gray-500 text-sm font-medium">Vehicle Loans</p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.vehicleLoans}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
