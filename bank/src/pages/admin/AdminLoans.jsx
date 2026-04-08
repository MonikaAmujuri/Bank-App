import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";
import { Eye, Trash2, RotateCcw, ChevronDown } from "lucide-react";

const AdminLoans = () => {
  const { token } = useAuth();
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loanTypeFilter = searchParams.get("loanType");
  const statusFilter = searchParams.get("status");
  const [showChart, setShowChart] = useState(false);
  const [activeLoanTypeIndex, setActiveLoanTypeIndex] = useState(0);
  const [expandedLoanId, setExpandedLoanId] = useState(null);

  const fetchLoans = async () => {
    try {
      const query = new URLSearchParams();

      query.append("all", "true");

      if (loanTypeFilter) {
        query.append("loanType", loanTypeFilter);
      }

      if (statusFilter === "in_progress") {
        query.append("status", "in_progress");
      } else if (statusFilter) {
        query.append("status", statusFilter);
      }

      const url = `http://localhost:5000/api/admin/loans?${query.toString()}`;

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

  const formatStatusLabel = (status) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "submitted":
        return "Submitted";
      case "under_review":
        return "Under Review";
      case "documents_pending":
        return "Documents Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "disbursed":
        return "Disbursed";
      case "pending":
        return "Pending";
      default:
        return status || "-";
    }
  };

  const pageTitle = loanTypeFilter
    ? `${loanTypeFilter}`
    : statusFilter
    ? `${formatStatusLabel(statusFilter)} Loans`
    : "Loans";

  const pageSubtitle = loanTypeFilter
    ? `Showing all ${loanTypeFilter.toLowerCase()} applications.`
    : statusFilter === "in_progress"
    ? "Showing all loans currently in progress."
    : statusFilter
    ? `Showing all ${formatStatusLabel(statusFilter).toLowerCase()} loan applications.`
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
    "#2563EB",
    "#7C3AED",
    "#F59E0B",
    "#22C55E",
    "#EF4444",
    "#0EA5E9",
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Approved
          </span>
        );

      case "draft":
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            Draft
          </span>
        );

      case "submitted":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Submitted
          </span>
        );

      case "under_review":
        return (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
            Under Review
          </span>
        );

      case "documents_pending":
        return (
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
            Documents Pending
          </span>
        );

      case "rejected":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
            Rejected
          </span>
        );

      case "disbursed":
        return (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            Disbursed
          </span>
        );

      case "pending":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            Pending
          </span>
        );

      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
            {status || "-"}
          </span>
        );
    }
  };

  const formatAmount = (amount) => {
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) return "₹0";
    return `₹${numericAmount.toLocaleString("en-IN")}`;
  };

  const formatLoanType = (loanType) => {
    if (!loanType) return "-";
    return loanType;
  };

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-5 text-white shadow-lg sm:rounded-3xl sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-100 sm:text-sm sm:tracking-widest">
              Admin Loans
            </p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-indigo-100 sm:text-base">
              {pageSubtitle}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto">
            {(loanTypeFilter || statusFilter) && (
              <button
                onClick={() => navigate("/admin/loans")}
                className="w-full rounded-xl border border-white/40 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto sm:px-5"
              >
                Clear Filter
              </button>
            )}
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full rounded-xl border border-white/40 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto sm:px-5"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Loan Summary
            </h2>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Overview of current records and loan type distribution.
            </p>
          </div>

          <button
            onClick={() => setShowChart(!showChart)}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 sm:w-auto"
          >
            {showChart ? "Show Cards" : "Show Loan Type Chart"}
          </button>
        </div>

        {!showChart ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
              <p className="text-sm font-medium text-gray-500">Current View</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{pageTitle}</h3>
              <p className="mt-2 text-sm text-gray-400">Showing all loans</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
              <p className="text-sm font-medium text-gray-500">Total Results</p>
              <h3 className="mt-2 text-2xl font-bold text-indigo-600">
                {loans.length}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Loans in current filtered list
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
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
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Loan Type Distribution
              </h3>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Percentage breakdown of the current loan type mix.
              </p>
            </div>

            {loanTypeChartData.length > 0 ? (
              <div className="grid gap-6 lg:gap-8 xl:grid-cols-2 xl:items-center">
                <div className="h-[260px] w-full sm:h-[320px] md:h-[360px]">
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

                <div className="space-y-3 sm:space-y-4">
                  {loanTypeChartData.map((item, index) => {
                    const percent = totalLoanTypeValue
                      ? ((item.value / totalLoanTypeValue) * 100).toFixed(1)
                      : 0;

                    return (
                      <div
                        key={item.name}
                        onClick={() => handleLoanTypePieClick(item)}
                        className="flex cursor-pointer items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 transition hover:bg-gray-100 sm:px-5 sm:py-4"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-4 w-4 rounded-full"
                            style={{
                              backgroundColor:
                                loanTypeChartColors[index % loanTypeChartColors.length],
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700 sm:text-base">
                            {item.name}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{item.value}</p>
                          <p className="text-xs text-gray-500 sm:text-sm">{percent}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-500 sm:text-base">
                No loan type data available.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Loan Records
            </h2>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Click any row to open full loan details.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            {loanTypeFilter && (
              <button
                onClick={() => navigate("/admin/loans")}
                className="w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 sm:w-auto"
              >
                Clear Loan Type
              </button>
            )}

            {statusFilter && (
              <button
                onClick={() => navigate("/admin/loans")}
                className="w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 sm:w-auto"
              >
                Clear Status
              </button>
            )}
          </div>
        </div>

        {loans.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
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
                        {formatLoanType(loan.loanDetails?.loanType)}
                      </td>

                      <td className="py-4 font-medium text-gray-800">
                        {formatAmount(loan.loanDetails?.amount)}
                      </td>

                      <td className="py-4">{getStatusBadge(loan.status)}</td>

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
                              className="rounded-xl px-4 py-2 text-sm font-medium text-green-600 transition hover:text-green-700"
                            >
                              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleArchive(loan.loanId, e)}
                              title="Delete"
                              aria-label="Delete"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-red-600 transition hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {loans.map((loan) => {
                const isExpanded = expandedLoanId === loan.loanId;

                return (
                  <div
                    key={loan.loanId}
                    className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4">
                      <div
                        className="flex items-start justify-between gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {loan.loanId}
                          </h3>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/loans/${loan.loanId}`)}
                            title="View"
                            aria-label="View"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 transition hover:bg-indigo-200"
                          >
                            <Eye className="h-4 w-4" strokeWidth={2.2} />
                          </button>

                          {loan.isArchived ? (
                            <button
                              onClick={(e) => handleRestore(loan.loanId, e)}
                              title="Restore"
                              aria-label="Restore"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-green-600 transition hover:text-green-700"
                            >
                              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleArchive(loan.loanId, e)}
                              title="Delete"
                              aria-label="Delete"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-red-600 transition hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedLoanId((prev) =>
                              prev === loan.loanId ? null : loan.loanId
                            )
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          <span>{isExpanded ? "Hide Details" : "Show Details"}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""
                              }`}
                            strokeWidth={2.2}
                          />
                        </button>
                      </div>

                      {isExpanded && (
                        <>
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(loan.status)}
                          </div>

                          <p className="text-sm font-medium text-gray-700">
                            {formatLoanType(loan.loanDetails?.loanType)}
                          </p>

                          <p className="text-sm text-gray-600">
                            {formatAmount(loan.loanDetails?.amount)}
                          </p>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                User
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-800">
                                {loan.userObjectId?.name || "-"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {loan.userObjectId?.userId || "-"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Created
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-800">
                                {new Date(loan.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Assigned Agent
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-800">
                                {loan.agentId?.name || "Unassigned"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Loan Type
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-800">
                                {formatLoanType(loan.loanDetails?.loanType)}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-500 sm:text-base">
            No loans found for this filter.
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminLoans;