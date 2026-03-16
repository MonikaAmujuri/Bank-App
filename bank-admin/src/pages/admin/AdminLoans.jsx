import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const AdminLoans = () => {
  const { token } = useAuth();
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const [searchParams] = useSearchParams();

  const loanTypeFilter = searchParams.get("loanType");
  const statusFilter = searchParams.get("status");

  const fetchLoans = async () => {
    try {
      const query = new URLSearchParams();

      if (showArchived) {
        query.append("showArchived", "true");
      }

      if (loanTypeFilter) {
        query.append("loanType", loanTypeFilter);
      }

      if (statusFilter) {
        query.append("status", statusFilter);
      }

      const url = `http://localhost:5000/api/admin/loans${
        query.toString() ? `?${query.toString()}` : ""
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
  }, [showArchived, token, loanTypeFilter, statusFilter]);

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
    ? `${loanTypeFilter} Loans`
    : statusFilter
    ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Loans`
    : "Loans";

  const pageSubtitle = loanTypeFilter
    ? `Showing all ${loanTypeFilter.toLowerCase()} applications.`
    : statusFilter
    ? `Showing all ${statusFilter.toLowerCase()} loan applications.`
    : "Manage submitted loans, review statuses, and track assigned agents.";

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
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
            >
              {showArchived ? "Hide Deleted" : "Show Deleted"}
            </button>

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Top filters summary */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Current View</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{pageTitle}</h3>
          <p className="mt-2 text-sm text-gray-400">
            {showArchived ? "Including archived loans" : "Showing active loans"}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Results</p>
          <h3 className="mt-2 text-2xl font-bold text-indigo-600">{loans.length}</h3>
          <p className="mt-2 text-sm text-gray-400">Loans in current filtered list</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Archive Mode</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {showArchived ? "Enabled" : "Disabled"}
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Toggle deleted loans visibility
          </p>
        </div>
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