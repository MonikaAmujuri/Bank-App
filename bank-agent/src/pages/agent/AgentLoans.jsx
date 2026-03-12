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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">{getPageTitle()}</h1>
        <p className="text-gray-500">
          Manage and track all loan records assigned to you.
        </p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              !showArchived
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Active Loans
          </button>

          <button
            onClick={() => setShowArchived(true)}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              showArchived
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            InActive Loans
          </button>
        </div>

        {(statusFilter || typeFilter) && (
          <button
            onClick={() => navigate("/agent/loans")}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {filteredLoans.length} loan
          {filteredLoans.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {errorMessage && (
          <p className="px-6 py-4 text-sm text-red-600">{errorMessage}</p>
        )}

        {!errorMessage && filteredLoans.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No loans found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Loan ID
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Customer ID
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Loan Type
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Assigned Agent
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLoans.map((loan) => (
                  <tr
                    key={loan._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {loan.loanId}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{loan.userId}</span>
                        {loan.userObjectId?.isDeleted && (
                          <span className="mt-1 inline-block w-fit px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                            User Inactive
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {formatLoanType(loan.loanDetails?.loanType)}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {formatAmount(loan.loanDetails?.amount)}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(loan.status)}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {loan.agentId ? loan.agentId.name : "Unassigned"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        {!showArchived && (
                          <>
                            <button
                              onClick={() => handleView(loan.loanId)}
                              disabled={loan.userObjectId?.isDeleted}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                loan.userObjectId?.isDeleted
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                              }`}
                            >
                              View
                            </button>

                            {loan.status === "draft" && (
                              <button
                                onClick={() => handleDelete(loan.loanId)}
                                className="px-3 py-1 rounded-md text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}

                        {showArchived && (
                          <button
                            onClick={() => handleRestore(loan.loanId)}
                            className="px-3 py-1 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition"
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
      </div>
    </div>
  );
};

export default AgentLoans;
