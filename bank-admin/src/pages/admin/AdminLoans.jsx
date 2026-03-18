import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";

const AdminLoans = () => {
  const { token } = useAuth();
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loanTypeFilter = searchParams.get("loanType");
  const statusFilter = searchParams.get("status");
  const [showChart, setShowChart] = useState(false);
  const [activeLoanTypeIndex, setActiveLoanTypeIndex] = useState(0);

  const fetchLoans = async () => {
  try {
    const query = new URLSearchParams();

    query.append("all", "true");

    if (loanTypeFilter) {
      query.append("loanType", loanTypeFilter);
    }

    if (statusFilter) {
      query.append("status", statusFilter);
    }

    const url = `http://localhost:5000/api/admin/loans?${
      query.toString()
    }`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLoans(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
  if (token) {
    fetchLoans();
  }
}, [token, loanTypeFilter, statusFilter]);

  const handleArchive = async (loanId, e) => {
    e.stopPropagation();

    const confirmArchive = window.confirm("Archive this loan?");
    if (!confirmArchive) return;

    try {
      await fetch(`http://localhost:5000/api/loans/${loanId}/archive`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchLoans();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRestore = async (loanId, e) => {
    e.stopPropagation();

    const confirmRestore = window.confirm("Restore this loan?");
    if (!confirmRestore) return;

    try {
      await fetch(`http://localhost:5000/api/loans/${loanId}/restore`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchLoans();
    } catch (error) {
      console.error(error);
    }
  };

  const pageTitle = loanTypeFilter
    ? `${loanTypeFilter}`
    : statusFilter
    ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Loans`
    : "Loans";

  const pageSubtitle = loanTypeFilter
    ? `Showing all ${loanTypeFilter.toLowerCase()} applications.`
    : statusFilter
    ? `Showing all ${statusFilter.toLowerCase()} loan applications.`
    : "Manage submitted loans, review statuses, and track assigned agents.";

  const loanTypeChartMap = loans.reduce((acc, loan) => {
  const type = loan.loanDetails?.loanType || "Unspecified";
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});

const loanTypeChartData = Object.entries(loanTypeChartMap).map(
  ([name, value]) => ({
    name,
    value,
  })
);

const loanTypeChartColors = [
  "#2563EB", // Home / first
  "#7C3AED", // Unknown
  "#F59E0B", // Business
  "#22C55E", // Education
  "#EF4444", // Personal
  "#0EA5E9", // Vehicle
];

const totalLoanTypeValue = loanTypeChartData.reduce(
  (sum, item) => sum + item.value,
  0
);

const renderPercentLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

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

const handleLoanTypePieClick = (data) => {
  if (!data?.name) return;

  if (data.name === "Unspecified") {
    navigate("/admin/loans?loanType=Unspecified");
  } else {
    navigate(`/admin/loans?loanType=${encodeURIComponent(data.name)}`);
  }
};

  const getStatusClasses = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Admin Loans
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">{pageTitle}</h1>
            <p className="mt-3 max-w-2xl text-indigo-100">{pageSubtitle}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {(loanTypeFilter || statusFilter) && (
            <button
            onClick={() => navigate("/admin/loans")}
            className="rounded-xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Clear Filter
              </button>
            )}
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </section>

      <section>
  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Loan Summary</h2>
      <p className="mt-1 text-gray-500">
        Overview of current records and loan type distribution.
      </p>
    </div>

    <button
      onClick={() => setShowChart(!showChart)}
      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
    >
      {showChart ? "Show Cards" : "Show Loan Type Chart"}
    </button>
  </div>

  {!showChart ? (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Current View</p>
        <h3 className="mt-2 text-2xl font-bold text-gray-900">{pageTitle}</h3>
        <p className="mt-2 text-sm text-gray-400">
          Showing all loans
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Total Results</p>
        <h3 className="mt-2 text-2xl font-bold text-indigo-600">
          {loans.length}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Loans in current filtered list
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Archive Mode</p>
        <h3 className="mt-2 text-2xl font-bold text-gray-900">
          Unified View
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Active and deleted loans shown together
        </p>
      </div>
    </div>
  ) : (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          Loan Type Distribution
        </h3>
        <p className="mt-1 text-gray-500">
          Percentage breakdown of the current loan type mix.
        </p>
      </div>

      {loanTypeChartData.length > 0 ? (
        <div className="grid gap-8 xl:grid-cols-2 xl:items-center">
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                activeIndex={activeLoanTypeIndex}
                activeShape={renderActiveShape}
                data={loanTypeChartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                dataKey="value"
                label={renderPercentLabel}
                labelLine={false}
                onMouseEnter={(_, index) => setActiveLoanTypeIndex(index)}
                onClick={handleLoanTypePieClick}
                >
                  {loanTypeChartData.map((entry, index) => (
                    <Cell
                    key={`loan-type-cell-${index}`}
                    fill={loanTypeChartColors[index % loanTypeChartColors.length]}
                    style={{ cursor: "pointer" }}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {loanTypeChartData.map((item, index) => {
              const percent = totalLoanTypeValue
                ? ((item.value / totalLoanTypeValue) * 100).toFixed(1)
                : 0;

              return (
                <div
                key={item.name}
                onClick={() => handleLoanTypePieClick(item)}
                className="flex cursor-pointer items-center justify-between rounded-2xl bg-gray-50 px-5 py-4 transition hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor:
                          loanTypeChartColors[index % loanTypeChartColors.length],
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
          No loan type data available.
        </div>
      )}
    </div>
  )}
</section>

      {/* Table card */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Loan Records</h2>
            <p className="mt-1 text-gray-500">
              Click any row to open full loan details.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {loanTypeFilter && (
              <button
                onClick={() => navigate("/admin/loans")}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                Clear Loan Type
              </button>
            )}

            {statusFilter && (
              <button
                onClick={() => navigate("/admin/loans")}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                Clear Status
              </button>
            )}
          </div>
        </div>

        {loans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-4 font-medium">Loan ID</th>
                  <th className="pb-4 font-medium">User</th>
                  <th className="pb-4 font-medium">Loan Type</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Created</th>
                  <th className="pb-4 font-medium">Assigned Agent</th>
                  <th className="pb-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loans.map((loan) => (
                  <tr
                    key={loan.loanId}
                    onClick={() => navigate(`/admin/loans/${loan.loanId}`)}
                    className="cursor-pointer border-b border-gray-50 transition hover:bg-gray-50 last:border-b-0"
                  >
                    <td className="py-4 font-semibold text-gray-900">{loan.loanId}</td>

                    <td className="py-4 text-gray-700">
                      <div className="font-medium text-gray-900">
                        {loan.userObjectId?.name || "-"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {loan.userObjectId?.userId || "-"}
                      </div>
                    </td>

                    <td className="py-4 text-gray-700">
                      {loan.loanDetails?.loanType || "-"}
                    </td>

                    <td className="py-4 font-medium text-gray-800">
                      ₹{loan.loanDetails?.amount || 0}
                    </td>

                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                          loan.status
                        )}`}
                      >
                        {loan.status}
                      </span>
                    </td>

                    <td className="py-4 text-gray-700">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4">
                      {loan.agentId?.name ? (
                        <span className="font-medium text-gray-800">
                          {loan.agentId.name}
                        </span>
                      ) : (
                        <span className="text-gray-500">Unassigned</span>
                      )}
                    </td>

                    <td className="py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/loans/${loan.loanId}`);
                          }}
                          className="rounded-xl bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200"
                        >
                          View
                        </button>

                        {loan.isArchived ? (
                          <button
                            onClick={(e) => handleRestore(loan.loanId, e)}
                            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleArchive(loan.loanId, e)}
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
            No loans found for this filter.
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminLoans;