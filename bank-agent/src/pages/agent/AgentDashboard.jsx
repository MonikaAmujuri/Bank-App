import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(() => {
  const savedStats = localStorage.getItem("agentDashboardStats");
  return savedStats
    ? JSON.parse(savedStats)
    : {
        totalUsers: 0,
        totalLoans: 0,
        draftLoans: 0,
        approvedLoans: 0,
        homeLoans: 0,
        personalLoans: 0,
        educationLoans: 0,
        vehicleLoans: 0,
        businessLoans: 0,
      };
});

  useEffect(() => {
    if (!token) return; // 🚨 important

    const fetchStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/agent/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setStats(data);
localStorage.setItem("agentDashboardStats", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">
        Agent Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => navigate("/agent/users")}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm font-medium">
            Total Customers
          </p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.totalUsers}
          </h2>
        </div>

        <div
          onClick={() => navigate("/agent/loans")}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm font-medium">
            Total Loans
          </p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.totalLoans}
          </h2>
        </div>

        <div
          onClick={() => navigate("/agent/loans?status=draft")}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm font-medium">
            Draft Loans
          </p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.draftLoans}
          </h2>
        </div>

        <div
          onClick={() => navigate("/agent/loans?status=approved")}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm font-medium">
            Approved Loans
          </p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.approvedLoans}
          </h2>
        </div>

        <div
          onClick={() => navigate("/agent/loans?type=Home Loan")}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm font-medium">
            Home Loans
          </p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.homeLoans}
          </h2>
        </div>

        <div
          onClick={() => navigate("/agent/loans?type=Personal Loan")}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm font-medium">
            Personal Loans
          </p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.personalLoans}
          </h2>
        </div>

        <div
          onClick={() => navigate("/agent/loans?type=Education Loan")}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm font-medium">
            Education Loans
          </p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.educationLoans}
          </h2>
        </div>

        <div
          onClick={() => navigate("/agent/loans?type=Vehicle Loan")}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm font-medium">
            Vehicle Loans
          </p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.vehicleLoans}
          </h2>
        </div>
        <div
          onClick={() => navigate("/agent/loans?type=Business Loan")}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm font-medium">
            Business Loans
          </p>
          <h2 className="text-4xl font-bold text-indigo-600 mt-2">
            {stats.businessLoans}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
