import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";

const AgentDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [showChart, setShowChart] = useState(false);
  const [activeOverviewIndex, setActiveOverviewIndex] = useState(0);
const [activeStatusIndex, setActiveStatusIndex] = useState(0);

  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem("agentDashboardStats");
    return savedStats
      ? JSON.parse(savedStats)
      : {
          totalUsers: 0,
          totalLoans: 0,
          pendingLoans: 0,
          draftLoans: 0,
          approvedLoans: 0,
          rejectedLoans: 0,
          homeLoans: 0,
          personalLoans: 0,
          educationLoans: 0,
          vehicleLoans: 0,
          businessLoans: 0,
          recentLoans: [],
        };
  });

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/agent/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setStats(data);
        localStorage.setItem("agentDashboardStats", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [token]);

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalUsers,
      subtitle: "Customers assigned to you",
      onClick: () => navigate("/agent/users"),
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      icon: "👥",
    },
    {
      title: "Total Loans",
      value: stats.totalLoans,
      subtitle: "All assigned loan records",
      onClick: () => navigate("/agent/loans"),
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: "📁",
    },
    {
      title: "Pending Loans",
      value: stats.pendingLoans || 0,
      subtitle: "Needs your review",
      onClick: () => navigate("/agent/loans?status=in_progress"),
      color: "text-sky-600",
      bg: "bg-sky-50",
      icon: "⏳",
    },
    {
      title: "Draft Loans",
      value: stats.draftLoans,
      subtitle: "Still incomplete",
      onClick: () => navigate("/agent/loans?status=draft"),
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: "📝",
    },
    {
      title: "Approved Loans",
      value: stats.approvedLoans,
      subtitle: "Completed approvals",
      onClick: () => navigate("/agent/loans?status=approved"),
      color: "text-green-600",
      bg: "bg-green-50",
      icon: "✅",
    },
    {
      title: "Disbursed Loans",
      value: stats.disbursedLoans,
      subtitle: "Completed applications",
      onClick: () => navigate("/agent/loans?status=disbursed"),
      color : "text-emerald-600",
      bg: "bg-emerald-50",
      icon: "💸",
    },
    {
      title: "Rejected Loans",
      value: stats.rejectedLoans,
      subtitle: "Declined applications",
      onClick: () => navigate("/agent/loans?status=rejected"),
      color: "text-red-600",
      bg: "bg-red-50",
      icon: "❌",
    }
  ];

  const loanTypeCards = [
    {
      title: "Home Loans",
      value: stats.homeLoans,
      onClick: () => navigate("/agent/loans?type=Home Loan"),
    },
    {
      title: "Personal Loans",
      value: stats.personalLoans,
      onClick: () => navigate("/agent/loans?type=Personal Loan"),
    },
    {
      title: "Education Loans",
      value: stats.educationLoans,
      onClick: () => navigate("/agent/loans?type=Education Loan"),
    },
    {
      title: "Vehicle Loans",
      value: stats.vehicleLoans,
      onClick: () => navigate("/agent/loans?type=Vehicle Loan"),
    },
    {
      title: "Business Loans",
      value: stats.businessLoans,
      onClick: () => navigate("/agent/loans?type=Business Loan"),
    },
  ];

  const recentLoans = stats.recentLoans || [];

  const overviewChartData = [
  { name: "Customers", value: stats.totalUsers || 0 },
  { name: "Total Loans", value: stats.totalLoans || 0 },
].filter((item) => item.value > 0);

const statusChartData = [
  { name: "Pending Loans", value: stats.pendingLoans || 0 },
  { name: "Draft Loans", value: stats.draftLoans || 0 },
  { name: "Approved Loans", value: stats.approvedLoans || 0 },
  { name: "Rejected Loans", value: stats.rejectedLoans || 0 },
  { name: "Disbursed Loans", value: stats.disbursedLoans || 0},
].filter((item) => item.value > 0);

const overviewColors = ["#4F46E5", "#2563EB"];
const statusColors = ["#0EA5E9", "#F59E0B", "#22C55E", "#EF4444", "#10b981"];

const renderPercentLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

const handleOverviewPieClick = (data) => {
  if (!data?.name) return;

  if (data.name === "Customers") {
    navigate("/agent/users");
  } else if (data.name === "Total Loans") {
    navigate("/agent/loans");
  }
};

const handleStatusPieClick = (data) => {
  if (!data?.name) return;

  if (data.name === "Pending Loans") {
    navigate("/agent/loans?status=in_progress");
  } else if (data.name === "Draft Loans") {
    navigate("/agent/loans?status=draft");
  } else if (data.name === "Approved Loans") {
    navigate("/agent/loans?status=approved");
  } else if (data.name === "Rejected Loans") {
    navigate("/agent/loans?status=rejected");
  } else if (data.name === "Disbursed Loans") {
    navigate("/agent/loans?status=disbursed");
  }
};

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 13}
        outerRadius={outerRadius + 19}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.18}
      />
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill="#111827"
        className="text-sm font-semibold"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fill="#6B7280"
        className="text-xs"
      >
        {value} ({(percent * 100).toFixed(1)}%)
      </text>
    </g>
  );
};

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Agent Workspace
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </h1>
            <p className="mt-3 max-w-2xl text-indigo-100">
              Track assigned loans, review pending applications, and manage your
              customer pipeline from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/agent/loans?status=in_progress")}
              className="rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
            >
              Review Pending Loans
            </button>
            <button
              onClick={() => navigate("/agent/loans")}
              className="rounded-xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              View All Loans
            </button>
          </div>
        </div>
      </section>

      <section>
  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">
        Overview
      </h2>
      <p className="mt-1 text-gray-500">
        Quick summary of your customers and current loan activity.
      </p>
    </div>

    <button
      onClick={() => setShowChart(!showChart)}
      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
    >
      {showChart ? "Show Cards" : "Show Charts"}
    </button>
  </div>

  {!showChart ? (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
  ) : (
    <div className="space-y-6">
      {/* Platform Overview */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Platform Overview
          </h3>
          <p className="mt-1 text-gray-500">
            Percentage split of customers and total assigned loans.
          </p>
        </div>

        {overviewChartData.length > 0 ? (
          <div className="grid gap-8 xl:grid-cols-2 xl:items-center">
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                  activeIndex={activeOverviewIndex}
                  activeShape={renderActiveShape}
                  data={overviewChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  dataKey="value"
                  label={renderPercentLabel}
                  labelLine={false}
                  onMouseEnter={(_, index) => setActiveOverviewIndex(index)}
                  onClick={handleOverviewPieClick}
                  >
                    {overviewChartData.map((entry, index) => (
                      <Cell
                      key={`overview-cell-${index}`}
                      fill={overviewColors[index % overviewColors.length]}
                      style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {overviewChartData.map((item, index) => {
                const total = overviewChartData.reduce(
                  (sum, current) => sum + current.value,
                  0
                );
                const percent = total
                  ? ((item.value / total) * 100).toFixed(1)
                  : 0;

                return (
                  <div
                  key={item.name}
                  onClick={() => handleOverviewPieClick(item)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl bg-gray-50 px-5 py-4 transition hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{
                          backgroundColor:
                            overviewColors[index % overviewColors.length],
                        }}
                      />
                      <span className="font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {item.value}
                      </p>
                      <p className="text-sm text-gray-500">{percent}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
            No overview data available.
          </div>
        )}
      </div>

      {/* Loan Status Distribution */}
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Loan Status Distribution
          </h3>
          <p className="mt-1 text-gray-500">
            Percentage breakdown of your current assigned loan statuses.
          </p>
        </div>

        {statusChartData.length > 0 ? (
          <div className="grid gap-8 xl:grid-cols-2 xl:items-center">
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                  activeIndex={activeStatusIndex}
                  activeShape={renderActiveShape}
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  dataKey="value"
                  label={renderPercentLabel}
                  labelLine={false}
                  onMouseEnter={(_, index) => setActiveStatusIndex(index)}
                  onClick={handleStatusPieClick}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                      key={`status-cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                      style={{ cursor: "pointer" }}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {statusChartData.map((item, index) => {
                const total = statusChartData.reduce(
                  (sum, current) => sum + current.value,
                  0
                );
                const percent = total
                  ? ((item.value / total) * 100).toFixed(1)
                  : 0;

                return (
                  <div
                  key={item.name}
                  onClick={() => handleStatusPieClick(item)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl bg-gray-50 px-5 py-4 transition hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{
                          backgroundColor:
                            statusColors[index % statusColors.length],
                        }}
                      />
                      <span className="font-medium text-gray-700">
                        {item.name}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {item.value}
                      </p>
                      <p className="text-sm text-gray-500">{percent}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
            No loan status data available.
          </div>
        )}
      </div>
    </div>
  )}
</section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Recent Loans
              </h2>
              <p className="mt-1 text-gray-500">
                Latest assigned loans for quick review.
              </p>
            </div>

            <button
              onClick={() => navigate("/agent/loans")}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              View All
            </button>
          </div>

          {recentLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-500">
                    <th className="pb-3 font-medium">Loan ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Loan Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoans.map((loan) => (
                    <tr
                      key={loan.loanId}
                      className="border-b border-gray-50 last:border-b-0"
                    >
                      <td className="py-4 font-semibold text-gray-900">
                        {loan.loanId}
                      </td>
                      <td className="py-4 text-gray-700">
                        {loan.userObjectId?.userId || loan.userId || "-"}
                      </td>
                      <td className="py-4 text-gray-700">
                        {loan.loanDetails?.loanType || "-"}
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            loan.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : loan.status === "pending"
                              ? "bg-blue-100 text-blue-700"
                              : loan.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : loan.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-800">
                        ₹{loan.loanDetails?.amount || 0}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => navigate(`/agent/loans/${loan.loanId}`)}
                          className="rounded-lg bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center text-gray-500">
              No recent loans available.
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">
              Loan Types
            </h2>
            <p className="mt-1 text-gray-500">
              Distribution of assigned loan categories.
            </p>

            <div className="mt-6 space-y-4">
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
              Jump to common agent tasks.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => navigate("/agent/loans?status=in_progress")}
                className="rounded-2xl bg-blue-50 px-4 py-4 text-left font-medium text-blue-700 transition hover:bg-blue-100"
              >
                Review Pending Loans
              </button>

              <button
                onClick={() => navigate("/agent/users")}
                className="rounded-2xl bg-indigo-50 px-4 py-4 text-left font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                Manage Customers
              </button>

              <button
                onClick={() => navigate("/agent/loans")}
                className="rounded-2xl bg-gray-50 px-4 py-4 text-left font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Open Loan Records
              </button>

              <button
                onClick={() => navigate("/agent/profile")}
                className="rounded-2xl bg-green-50 px-4 py-4 text-left font-medium text-green-700 transition hover:bg-green-100"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgentDashboard;