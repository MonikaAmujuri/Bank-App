import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem("adminDashboardStats");
    return savedStats
      ? JSON.parse(savedStats)
      : {
          users: 0,
          agents: 0,
          loans: 0,
          pendingLoans: 0,
          draftLoans: 0,
          approvedLoans: 0,
          homeLoans: 0,
          personalLoans: 0,
          educationLoans: 0,
          businessLoans: 0,
          vehicleLoans: 0,
        };
  });

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setStats(data);
        localStorage.setItem("adminDashboardStats", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [token]);

  const statCards = [
    {
      title: "Total Customers",
      value: stats.users,
      subtitle: "Registered platform users",
      onClick: () => navigate("/admin/users"),
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      icon: "👥",
    },
    {
      title: "Total Agents",
      value: stats.agents,
      subtitle: "Active loan agents",
      onClick: () => navigate("/admin/agents"),
      color: "text-violet-600",
      bg: "bg-violet-50",
      icon: "🧑‍💼",
    },
    {
      title: "Total Loans",
      value: stats.loans,
      subtitle: "All submitted applications",
      onClick: () => navigate("/admin/loans"),
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: "📁",
    },
    {
      title: "Pending Loans",
      value: stats.pendingLoans || 0,
      subtitle: "Awaiting review",
      onClick: () => navigate("/admin/loans?status=pending"),
      color: "text-sky-600",
      bg: "bg-sky-50",
      icon: "⏳",
    },
    {
      title: "Draft Loans",
      value: stats.draftLoans || 0,
      subtitle: "Incomplete applications",
      onClick: () => navigate("/admin/loans?status=draft"),
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: "📝",
    },
    {
      title: "Approved Loans",
      value: stats.approvedLoans || 0,
      subtitle: "Completed approvals",
      onClick: () => navigate("/admin/loans?status=approved"),
      color: "text-green-600",
      bg: "bg-green-50",
      icon: "✅",
    },
  ];

  const loanTypeCards = [
    {
      title: "Home Loans",
      value: stats.homeLoans,
      onClick: () => navigate("/admin/loans?loanType=Home Loan"),
    },
    {
      title: "Personal Loans",
      value: stats.personalLoans,
      onClick: () => navigate("/admin/loans?loanType=Personal Loan"),
    },
    {
      title: "Education Loans",
      value: stats.educationLoans,
      onClick: () => navigate("/admin/loans?loanType=Education Loan"),
    },
    {
      title: "Business Loans",
      value: stats.businessLoans,
      onClick: () => navigate("/admin/loans?loanType=Business Loan"),
    },
    {
      title: "Vehicle Loans",
      value: stats.vehicleLoans,
      onClick: () => navigate("/admin/loans?loanType=Vehicle Loan"),
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Admin Workspace
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">
              Welcome back{user?.name ? `, ${user.name}` : ", Admin"}
            </h1>
            <p className="mt-3 max-w-2xl text-indigo-100">
              Monitor customers, manage agents, and review all loan activity
              from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/admin/loans?status=pending")}
              className="rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
            >
              Review Pending Loans
            </button>
            <button
              onClick={() => navigate("/admin/loans")}
              className="rounded-xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              View All Loans
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
          <p className="mt-1 text-gray-500">
            Quick summary of your platform users and loan workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6">
          {statCards.map((card) => (
            <div
              key={card.title}
              onClick={card.onClick}
              className="group cursor-pointer rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg} text-xl`}
                >
                  {card.icon}
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                {card.title}
              </p>
              <h3 className={`mt-2 text-4xl font-bold ${card.color}`}>
                {card.value}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Loan Types
              </h2>
              <p className="mt-1 text-gray-500">
                Distribution of submitted loan categories.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/loans")}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loanTypeCards.map((card) => (
              <button
                key={card.title}
                onClick={card.onClick}
                className="flex w-full items-center justify-between rounded-2xl bg-gray-50 px-4 py-4 text-left transition hover:bg-gray-100"
              >
                <span className="font-medium text-gray-700">{card.title}</span>
                <span className="text-xl font-bold text-indigo-600">
                  {card.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">
            Quick Actions
          </h2>
          <p className="mt-1 text-gray-500">
            Jump to common admin tasks.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate("/admin/users")}
              className="rounded-2xl bg-indigo-50 px-4 py-4 text-left font-medium text-indigo-700 transition hover:bg-indigo-100"
            >
              Manage Customers
            </button>

            <button
              onClick={() => navigate("/admin/agents")}
              className="rounded-2xl bg-violet-50 px-4 py-4 text-left font-medium text-violet-700 transition hover:bg-violet-100"
            >
              Manage Agents
            </button>

            <button
              onClick={() => navigate("/admin/loans?status=pending")}
              className="rounded-2xl bg-blue-50 px-4 py-4 text-left font-medium text-blue-700 transition hover:bg-blue-100"
            >
              Review Pending Loans
            </button>

            <button
              onClick={() => navigate("/admin/profile")}
              className="rounded-2xl bg-green-50 px-4 py-4 text-left font-medium text-green-700 transition hover:bg-green-100"
            >
              View Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;