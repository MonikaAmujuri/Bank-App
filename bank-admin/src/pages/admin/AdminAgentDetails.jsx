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
          setData((prev) => ({ ...prev, users: result, totalUsers: result.length }));
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          Agent Details
        </h1>

        <button
          onClick={handleResetPassword}
          disabled={loadingReset}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          {loadingReset ? "Resetting..." : "Reset Password"}
        </button>
      </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Users Registered</p>
                  <p className="text-2xl font-bold">{data.totalUsers}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Total Loans</p>
                  <p className="text-2xl font-bold">{data.totalLoans}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Approved Loans</p>
                  <p className="text-2xl font-bold">{data.approvedLoans}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-gray-500 text-sm">Approval Rate</p>
                  <p className="text-2xl font-bold">{data.approvalRate}%</p>
              </div>
          </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">User ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Loan Type</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data.users) && data.users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.userId}</td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.loanType}</td>
                <td className="p-4">
                  {user.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.users.length === 0 && (
          <p className="p-6 text-gray-500 text-center">
            No users registered by this agent
          </p>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 text-center">
            <h2 className="text-lg font-semibold text-green-600 mb-3">
              Password Reset Successful
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              New Password:
            </p>

            <div className="bg-gray-100 p-3 rounded-lg font-mono mb-4">
              {generatedPassword}
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(generatedPassword)}
              className="text-blue-600 underline mb-4 block"
            >
              Copy Password
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
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
