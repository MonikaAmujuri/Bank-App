import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminAgentDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  const [data, setData] = useState({
    totalUsers: 0,
    totalLoans: 0,
    approvedLoans: 0,
    approvalRate: 0,
    users: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/agent/${id}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

        if (Array.isArray(result)) {
          setData((prev) => ({
            ...prev,
            users: result,
            totalUsers: result.length,
          }));
        } else {
          setData({
            totalUsers: result?.totalUsers || 0,
            totalLoans: result?.totalLoans || 0,
            approvedLoans: result?.approvedLoans || 0,
            approvalRate: result?.approvalRate || 0,
            users: Array.isArray(result?.users) ? result.users : [],
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (token) fetchUsers();
  }, [id, token]);

  const handleResetPassword = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset this agent's password?"
    );
    if (!confirmReset) return;

    try {
      setLoadingReset(true);

      const res = await fetch(
        `http://localhost:5000/api/admin/agents/${id}/reset-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      setGeneratedPassword(result.newPassword);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Admin Agent Details
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">Agent Details</h1>
            <p className="mt-3 max-w-2xl text-indigo-100">
              Review this agent’s customer activity, loan performance, and account
              access from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleResetPassword}
              disabled={loadingReset}
              className="rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loadingReset ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Users Registered</p>
          <h3 className="mt-2 text-4xl font-bold text-indigo-600">
            {data.totalUsers}
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Customers registered by this agent
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Loans</p>
          <h3 className="mt-2 text-4xl font-bold text-blue-600">
            {data.totalLoans}
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Overall submitted loan applications
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Approved Loans</p>
          <h3 className="mt-2 text-4xl font-bold text-green-600">
            {data.approvedLoans}
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Successfully approved applications
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Approval Rate</p>
          <h3 className="mt-2 text-4xl font-bold text-violet-600">
            {data.approvalRate}%
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Approval percentage for this agent
          </p>
        </div>
      </section>

      {/* Users table */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Registered Customers
          </h2>
          <p className="mt-1 text-gray-500">
            Customers currently associated with this agent.
          </p>
        </div>

        {data.users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-4 font-medium">User ID</th>
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">Email</th>
                  <th className="pb-4 font-medium">Loan Type</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(data.users) &&
                  data.users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-50 transition hover:bg-gray-50 last:border-b-0"
                    >
                      <td className="py-4 font-semibold text-gray-900">
                        {user.userId}
                      </td>

                      <td className="py-4 font-medium text-gray-900">
                        {user.name}
                      </td>

                      <td className="py-4 text-gray-700">{user.email}</td>

                      <td className="py-4 text-gray-700">{user.loanType || "-"}</td>

                      <td className="py-4">
                        {user.isActive ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
            No users registered by this agent.
          </div>
        )}
      </section>

      {/* Password reset modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-semibold text-green-600">
              Password Reset Successful
            </h2>

            <p className="mt-4 text-sm text-gray-500">New Password</p>

            <div className="mt-3 rounded-2xl bg-gray-100 p-4 font-mono text-gray-900">
              {generatedPassword}
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(generatedPassword)}
              className="mt-4 text-sm font-medium text-indigo-600 underline"
            >
              Copy Password
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgentDetails;