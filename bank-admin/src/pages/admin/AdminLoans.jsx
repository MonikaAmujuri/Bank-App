import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const AdminLoans = () => {
  const { token } = useAuth();
  const [loans, setLoans] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState({});
  const [assigningLoanId, setAssigningLoanId] = useState("");
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const [searchParams] = useSearchParams();
  const loanTypeFilter = searchParams.get("loanType");

  const fetchLoans = async () => {
    try {
      const query = new URLSearchParams();

      if (showArchived) {
        query.append("showArchived", "true");
      }

      if (loanTypeFilter) {
        query.append("loanType", loanTypeFilter);
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

  const fetchAgents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/agents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAgents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLoans();
      fetchAgents();
    }
  }, [showArchived, token, loanTypeFilter]);

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

  const handleAssignAgent = async (loanId, e) => {
    e.stopPropagation();

    const agentId = selectedAgents[loanId];

    if (!agentId) {
      alert("Please select an agent first");
      return;
    }

    try {
      setAssigningLoanId(loanId);

      const res = await fetch(
        `http://localhost:5000/api/admin/loans/${loanId}/assign-agent`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ agentId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to assign agent");
      }

      fetchLoans();
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setAssigningLoanId("");
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold">
        {loanTypeFilter
          ? `${loanTypeFilter.charAt(0).toUpperCase() + loanTypeFilter.slice(1)} Loans`
          : "Loans"}
      </h1>

      <button
        onClick={() => setShowArchived(!showArchived)}
        className="mb-4 rounded-md bg-gray-700 px-4 py-2 text-white"
      >
        {showArchived ? "Hide Deleted" : "Show Deleted"}
      </button>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Loan ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Loan Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Assigned Agent</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => (
              <tr
                key={loan.loanId}
                onClick={() => navigate(`/admin/loans/${loan.loanId}`)}
                className="cursor-pointer transition hover:bg-gray-50"
              >
                <td className="p-4">{loan.loanId}</td>

                <td className="p-4">
                  {loan.userObjectId?.name} ({loan.userObjectId?.userId})
                </td>

                <td className="p-4">{loan.loanDetails?.loanType || "-"}</td>

                <td className="p-4">₹{loan.loanDetails?.amount || 0}</td>

                <td className="p-4">
                  <span
                    className={`rounded px-2 py-1 text-sm font-medium ${
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

                <td className="p-4">
                  {new Date(loan.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {loan.agentId?.name ? (
                    <span className="font-medium text-gray-800">
                      {loan.agentId.name}
                    </span>
                  ) : (
                    <span className="text-gray-500">Unassigned</span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/loans/${loan.loanId}`);
                      }}
                      className="rounded-md bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
                    >
                      View
                    </button>

                    <select
                      value={selectedAgents[loan.loanId] || ""}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        setSelectedAgents((prev) => ({
                          ...prev,
                          [loan.loanId]: e.target.value,
                        }))
                      }
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">Select Agent</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name} ({agent.agentId})
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={(e) => handleAssignAgent(loan.loanId, e)}
                      disabled={assigningLoanId === loan.loanId}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {assigningLoanId === loan.loanId
                        ? "Saving..."
                        : loan.agentId
                        ? "Change Agent"
                        : "Assign Agent"}
                    </button>

                    {loan.isArchived ? (
                      <button
                        onClick={(e) => handleRestore(loan.loanId, e)}
                        className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleArchive(loan.loanId, e)}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white"
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

        {loans.length === 0 && (
          <p className="p-6 text-center text-gray-500">No loans found</p>
        )}
      </div>
    </div>
  );
};

export default AdminLoans;