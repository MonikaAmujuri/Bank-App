import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";

const AgentLoans = () => {
  const { token } = useAuth();
  const [loans, setLoans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeStatusIndex, setActiveStatusIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const statusFilter = searchParams.get("status");
  const typeFilter = searchParams.get("type");
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
  if (token) {
    fetchLoans();
  }
}, [token, statusFilter, typeFilter]);

  const fetchLoans = async () => {
  try {
    const params = new URLSearchParams({
      all: "true",
    });

    if (statusFilter) params.append("status", statusFilter);
    if (typeFilter) params.append("type", typeFilter);

    const res = await fetch(
      `http://localhost:5000/api/agent/loans?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setLoans([]);
      setErrorMessage(data.message || "Failed to load loans");
      return;
    }

    setErrorMessage("");
    setLoans(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
    setLoans([]);
    setErrorMessage("Failed to load loans");
  }
};

  const filteredLoans = loans.filter((loan) => {
    const matchesStatus = statusFilter
      ? loan.status?.toLowerCase() === statusFilter.toLowerCase()
      : true;

    const matchesType = typeFilter
      ? loan.loanDetails?.loanType?.toLowerCase() === typeFilter.toLowerCase()
      : true;

    return matchesStatus && matchesType;
  });

  const handleView = (loanId) => {
    navigate(`/agent/loans/${loanId}`);
  };

  const handleDelete = async (loanId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to archive this loan?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/loans/${loanId}/archive`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Archive failed");

      alert("Loan archived successfully");
      fetchLoans();
    } catch (error) {
      console.error(error);
      alert("Failed to archive loan");
    }
  };

  const handleRestore = async (loanId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/loans/${loanId}/restore`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to restore loan");
        return;
      }

      alert("Loan restored successfully");
      fetchLoans();
    } catch (error) {
      console.error(error);
      alert("Failed to restore loan");
    }
  };

  const getPageTitle = () => {
    const formatWord = (value) =>
      value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

    if (statusFilter && typeFilter) {
      return `${formatWord(typeFilter)} ${formatWord(statusFilter)} Loans`;
    }

    if (typeFilter) {
      return `${formatWord(typeFilter)} Loans`;
    }

    if (statusFilter) {
      return `${formatWord(statusFilter)} Loans`;
    }

    return "All Loans";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            Approved
          </span>
        );
      case "draft":
        return (
          <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            Draft
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            Rejected
          </span>
        );
      case "modified":
        return (
          <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
            Modified
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
            {status || "-"}
          </span>
        );
    }
  };

  const statusChartData = [
  { name: "Draft Loans", value: loans.filter((loan) => loan.status === "draft").length },
  { name: "Pending Loans", value: loans.filter((loan) => loan.status === "pending").length },
  { name: "Approved Loans", value: loans.filter((loan) => loan.status === "approved").length },
  { name: "Rejected Loans", value: loans.filter((loan) => loan.status === "rejected").length },
].filter((item) => item.value > 0);

const statusChartColors = ["#F59E0B", "#0EA5E9", "#22C55E", "#EF4444"];

const totalStatusValue = statusChartData.reduce((sum, item) => sum + item.value, 0);

const renderPercentLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

  const formatLoanType = (loanType) => {
    if (!loanType) return "-";
    return loanType.charAt(0).toUpperCase() + loanType.slice(1);
  };

  const formatAmount = (amount) => {
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) return "₹0";
    return `₹${numericAmount.toLocaleString("en-IN")}`;
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

const handleStatusPieClick = (data) => {
  if (!data?.name) return;

  if (data.name === "Pending Loans") {
    navigate("/agent/loans?status=pending");
  } else if (data.name === "Draft Loans") {
    navigate("/agent/loans?status=draft");
  } else if (data.name === "Approved Loans") {
    navigate("/agent/loans?status=approved");
  } else if (data.name === "Rejected Loans") {
    navigate("/agent/loans?status=rejected");
  }
};

  return (
  <div className="space-y-8">
    <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
            Loan Management
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">{getPageTitle()}</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            Manage, review, and track all loan records assigned to you.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {statusFilter && (
            <button
            onClick={() => navigate("/agent/loans")}
            className="rounded-2xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Clear Filter
            </button>
          )}
          <button
            onClick={() => navigate("/agent/loans?status=pending")}
            className="rounded-2xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
          >
            Pending Loans
          </button>

          <button
            onClick={() => navigate("/agent/loans")}
            className="rounded-2xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            View All
          </button>
        </div>
      </div>
    </section>

    <section>
  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Loan Summary</h2>
      <p className="mt-1 text-gray-500">
        Overview of your assigned loans and current workflow status.
      </p>
    </div>

    <button
      onClick={() => setShowChart(!showChart)}
      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
    >
      {showChart ? "Show Cards" : "Show Status Chart"}
    </button>
  </div>

  {!showChart ? (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Visible Loans</p>
        <h3 className="mt-2 text-4xl font-bold text-indigo-600">{loans.length}</h3>
        <p className="mt-2 text-sm text-gray-400">
          Loans in the current filtered view
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Draft Loans</p>
        <h3 className="mt-2 text-4xl font-bold text-amber-500">
          {loans.filter((loan) => loan.status === "draft").length}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Incomplete or editable loans
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Pending Loans</p>
        <h3 className="mt-2 text-4xl font-bold text-sky-600">
          {loans.filter((loan) => loan.status === "pending").length}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Waiting for final review or approval
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Approved Loans</p>
        <h3 className="mt-2 text-4xl font-bold text-green-600">
          {loans.filter((loan) => loan.status === "approved").length}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Successfully approved records
        </p>
      </div>
    </div>
  ) : (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          Loan Status Distribution
        </h3>
        <p className="mt-1 text-gray-500">
          Percentage breakdown of your current loan workflow.
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
                    fill={statusChartColors[index % statusChartColors.length]}
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
              const percent = totalStatusValue
                ? ((item.value / totalStatusValue) * 100).toFixed(1)
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
                          statusChartColors[index % statusChartColors.length],
                      }}
                    />
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.value}</p>
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
  )}
</section>

    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  <div>
    <h2 className="text-2xl font-semibold text-gray-900">
      Loan Records
    </h2>
    <p className="mt-1 text-gray-500">
      Review customer loan details and continue the workflow from here.
    </p>
  </div>

  {(statusFilter || typeFilter) && (
    <button
      onClick={() => navigate("/agent/loans")}
      className="w-fit rounded-2xl bg-gray-100 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-200"
    >
      Clear Filters
    </button>
  )}
</div>

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredLoans.length} loan
          {filteredLoans.length !== 1 ? "s" : ""}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {!errorMessage && filteredLoans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-14 text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            No loans found
          </h3>
          <p className="mt-2 text-gray-500">
            No loan records match the current filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-4 font-semibold">Loan ID</th>
                <th className="pb-4 font-semibold">Customer</th>
                <th className="pb-4 font-semibold">Loan Type</th>
                <th className="pb-4 font-semibold">Amount</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold">Created</th>
                <th className="pb-4 font-semibold">Assigned Agent</th>
                <th className="pb-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLoans.map((loan) => (
                <tr
                  key={loan._id}
                  className="border-b border-gray-50 transition hover:bg-gray-50"
                >
                  <td className="py-5 font-semibold text-gray-900">
                    {loan.loanId}
                  </td>

                  <td className="py-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {loan.userId}
                      </span>

                      {loan.userObjectId?.isDeleted && (
                        <span className="mt-1 inline-block w-fit rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                          User Inactive
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-5 text-gray-700">
                    {formatLoanType(loan.loanDetails?.loanType)}
                  </td>

                  <td className="py-5 text-gray-800">
                    {formatAmount(loan.loanDetails?.amount)}
                  </td>

                  <td className="py-5">{getStatusBadge(loan.status)}</td>

                  <td className="py-5 text-gray-600">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-5 text-gray-700">
                    {loan.agentId ? loan.agentId.name : "Unassigned"}
                  </td>

                  <td className="py-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                      onClick={() => handleView(loan.loanId)}
                      disabled={loan.userObjectId?.isDeleted}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                        loan.userObjectId?.isDeleted
                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }`}
                      >
                        View
                      </button>
                      
                    {loan.status === "draft" && !loan.isArchived && (
                      <button
                      onClick={() => handleDelete(loan.loanId)}
                      className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    )}
                    
                    {loan.isArchived && (
                      <button
                      onClick={() => handleRestore(loan.loanId)}
                      className="rounded-xl bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </div>
);
};

export default AgentLoans;
