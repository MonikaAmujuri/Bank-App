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
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-5 text-white shadow-lg sm:rounded-3xl sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-indigo-100 sm:text-sm sm:tracking-widest">
              Admin Agent Details
            </p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              Agent Details
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
              Review this agent’s customer activity, loan performance, and account
              access from one place.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <button
              onClick={handleResetPassword}
              disabled={loadingReset}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-5"
            >
              {loadingReset ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:rounded-3xl sm:p-6">
          <p className="text-sm font-medium text-gray-500">Users Registered</p>
          <h3 className="mt-2 text-3xl font-bold text-indigo-600 sm:text-4xl">
            {data.totalUsers}
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Customers registered by this agent
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:rounded-3xl sm:p-6">
          <p className="text-sm font-medium text-gray-500">Total Loans</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600 sm:text-4xl">
            {data.totalLoans}
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Overall submitted loan applications
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:rounded-3xl sm:p-6">
          <p className="text-sm font-medium text-gray-500">Approved Loans</p>
          <h3 className="mt-2 text-3xl font-bold text-green-600 sm:text-4xl">
            {data.approvedLoans}
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Successfully approved applications
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:rounded-3xl sm:p-6">
          <p className="text-sm font-medium text-gray-500">Approval Rate</p>
          <h3 className="mt-2 text-3xl font-bold text-violet-600 sm:text-4xl">
            {data.approvalRate}%
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Approval percentage for this agent
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:rounded-3xl sm:p-6">
        <div className="mb-5 sm:mb-6">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Registered Customers
          </h2>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Customers currently associated with this agent.
          </p>
        </div>

        {data.users.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
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

            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {Array.isArray(data.users) &&
                data.users.map((user) => (
                  <div
                    key={user._id}
                    className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-gray-900">
                              {user.name}
                            </h3>

                            {user.isActive ? (
                              <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700">
                                Active
                              </span>
                            ) : (
                              <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-medium text-red-700">
                                Inactive
                              </span>
                            )}
                          </div>

                          <p className="mt-1 break-all text-sm text-gray-600">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-white/80 p-3 ring-1 ring-gray-100">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            User ID
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {user.userId}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white/80 p-3 ring-1 ring-gray-100">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            Loan Type
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {user.loanType || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-500 sm:text-base">
            No users registered by this agent.
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 text-center shadow-2xl sm:rounded-3xl sm:p-6">
            <h2 className="text-xl font-semibold text-green-600 sm:text-2xl">
              Password Reset Successful
            </h2>

            <p className="mt-4 text-sm text-gray-500">New Password</p>

            <div className="mt-3 break-all rounded-2xl bg-gray-100 p-4 font-mono text-sm text-gray-900 sm:text-base">
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
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 sm:text-base"
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