import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";

const AgentLoans = () => {
  const { token } = useAuth();
  const [loans, setLoans] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const [assigningId, setAssigningId] = useState(null);
  const statusFilter = searchParams.get("status");
  const typeFilter = searchParams.get("type");

  useEffect(() => {
    if (token) {
      fetchLoans();
    }
  }, [token, statusFilter, typeFilter, showArchived]);

  const fetchLoans = async () => {
    try {
      const params = new URLSearchParams({
        archived: String(showArchived),
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

  const assignLoan = async (loanId) => {
    setAssigningId(loanId);

    try {
      const res = await fetch(
        'http://localhost:5000/api/agent/loans/${loanId}/assign',
        {
          method: "POST",
          headers: {
            Authorization: 'Bearer ${token}',
          },
        }
      );
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Request failed with status ${res.status}');
      }
      if(!res.ok) {
        alert(data.message || "Failed to assign loan");
      }
      
      fetchLoans();
     } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
     } finally {
      setAssigningId("");
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

  const formatLoanType = (loanType) => {
    if (!loanType) return "-";
    return loanType.charAt(0).toUpperCase() + loanType.slice(1);
  };

  const formatAmount = (amount) => {
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) return "₹0";
    return `₹${numericAmount.toLocaleString("en-IN")}`;
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

    <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Visible Loans</p>
        <h2 className="mt-3 text-4xl font-bold text-indigo-600">
          {filteredLoans.length}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Loans in the current filtered view
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Draft Loans</p>
        <h2 className="mt-3 text-4xl font-bold text-amber-500">
          {filteredLoans.filter((loan) => loan.status === "draft").length}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Incomplete or editable loans
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Pending Loans</p>
        <h2 className="mt-3 text-4xl font-bold text-blue-600">
          {filteredLoans.filter((loan) => loan.status === "pending").length}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Waiting for final review or approval
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Approved Loans</p>
        <h2 className="mt-3 text-4xl font-bold text-green-600">
          {filteredLoans.filter((loan) => loan.status === "approved").length}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Successfully approved records
        </p>
      </div>
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

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowArchived(false)}
            className={`rounded-2xl px-5 py-2.5 font-medium transition ${
              !showArchived
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active Loans
          </button>

          <button
            onClick={() => setShowArchived(true)}
            className={`rounded-2xl px-5 py-2.5 font-medium transition ${
              showArchived
                ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Inactive Loans
          </button>

          {(statusFilter || typeFilter) && (
            <button
              onClick={() => navigate("/agent/loans")}
              className="rounded-2xl bg-gray-100 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-200"
            >
              Clear Filters
            </button>
          )}
        </div>
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
                      {!showArchived && (
                        <>
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

                          {loan.status === "draft" && (
                            <button
                              onClick={() => handleDelete(loan.loanId)}
                              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}

                      {showArchived && (
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
