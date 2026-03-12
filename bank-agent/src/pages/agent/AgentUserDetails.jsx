import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AgentUserDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();

  const [data, setData] = useState({
    user: null,
    loans: [],
  });

  const [showEditModal, setShowEditModal] = useState(false);
const [editForm, setEditForm] = useState({
  name: "",
  email: "",
  phone: "",
  panNumber: "",
  aadharNumber: "",
  address: "",
});

const [showPasswordModal, setShowPasswordModal] = useState(false);
const [resetPasswordData, setResetPasswordData] = useState({
  name: "",
  email: "",
  password: "",
});

  const parseJsonResponse = async (res) => {
    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error(
        `Expected JSON but received ${res.status} ${res.statusText}: ${text.slice(0, 120)}`
      );
    }

    return res.json();
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/agent/users/${id}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await parseJsonResponse(res);

        if (!res.ok) {
          throw new Error(result.message || "Failed to load customer details");
        }

        setData(result);
          setEditForm({
              name: result.user.name || "",
              email: result.user.email || "",
              phone: result.user.phone || "",
              panNumber: result.user.panNumber || "",
              aadharNumber: result.user.aadharNumber || "",
              address: result.user.address || "",
          });
      } catch (error) {
        console.error(error);
      }
    };

    if (token) fetchDetails();
  }, [id, token]);

  if (!data.user) {
    return <div>Loading...</div>;
  }

  const handleUpdateUser = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      `http://localhost:5000/api/agent/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      }
    );

    const result = await parseJsonResponse(res);

    if (!res.ok) {
      throw new Error(result.message || "Failed to update user");
    }

    setData((prev) => ({
      ...prev,
      user: result.user,
    }));

    setShowEditModal(false);
    alert("Customer updated successfully");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const handleResetPassword = async (userId) => {
  const confirmReset = window.confirm(
    "Are you sure you want to reset this customer's password?"
  );

  if (!confirmReset) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/agent/users/${userId}/reset-password`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await parseJsonResponse(res);

    if (!res.ok) {
      throw new Error(result.message || "Failed to reset password");
    }

    setResetPasswordData({
      name: result.user.name,
      email: result.user.email,
      password: result.newPassword,
    });

    setShowPasswordModal(true);
  } catch (error) {
    console.error(error);
    alert(error.message || "Something went wrong");
  }
};

const handleCopyPassword = async () => {
  try {
    await navigator.clipboard.writeText(resetPasswordData.password);
    alert("Password copied to clipboard");
  } catch (error) {
    console.error(error);
    alert("Failed to copy password");
  }
};

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Customer Details</h1>

        <div className="flex items-center gap-3">

              <button
                  onClick={() => setShowEditModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                  Edit
              </button>
        <button
          onClick={() => handleResetPassword(data.user._id)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Reset Password
        </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Customer ID:</strong> {data.user.userId}</p>
          <p><strong>Name:</strong> {data.user.name}</p>
          <p><strong>Email:</strong> {data.user.email}</p>
          <p><strong>Phone:</strong> {data.user.phone || "-"}</p>
          <p><strong>PAN:</strong> {data.user.panNumber || "-"}</p>
          <p><strong>Aadhar:</strong> {data.user.aadharNumber || "-"}</p>
          <p><strong>Address:</strong> {data.user.address || "-"}</p>
          <p><strong>Status:</strong> {data.user.isDeleted ? "Inactive" : "Active"}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Loan History</h2>

        {data.loans.length === 0 ? (
          <p className="text-gray-500">No loans found for this customer.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-3">Loan ID</th>
                <th className="py-3">Loan Type</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Status</th>
                <th className="py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.loans.map((loan) => (
                <tr key={loan._id} className="border-b">
                  <td className="py-3">{loan.loanId}</td>
                  <td className="py-3">{loan.loanDetails?.loanType || "-"}</td>
                  <td className="py-3">₹{loan.loanDetails?.amount || 0}</td>
                  <td className="py-3 capitalize">{loan.status}</td>
                  <td className="py-3">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
          {showEditModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
                      <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>

                      <form onSubmit={handleUpdateUser} className="space-y-4">
                          <input
                              type="text"
                              placeholder="Name"
                              value={editForm.name}
                              onChange={(e) =>
                                  setEditForm({ ...editForm, name: e.target.value })
                              }
                              className="w-full border px-3 py-2 rounded-lg"
                              required
                          />

                          <input
                              type="email"
                              placeholder="Email"
                              value={editForm.email}
                              onChange={(e) =>
                                  setEditForm({ ...editForm, email: e.target.value })
                              }
                              className="w-full border px-3 py-2 rounded-lg"
                              required
                          />

                          <input
                              type="text"
                              placeholder="Phone"
                              value={editForm.phone}
                              onChange={(e) =>
                                  setEditForm({ ...editForm, phone: e.target.value })
                              }
                              className="w-full border px-3 py-2 rounded-lg"
                          />

                          <input
                              type="text"
                              placeholder="PAN Number"
                              value={editForm.panNumber}
                              onChange={(e) =>
                                  setEditForm({ ...editForm, panNumber: e.target.value })
                              }
                              className="w-full border px-3 py-2 rounded-lg"
                          />

                          <input
                              type="text"
                              placeholder="Aadhar Number"
                              value={editForm.aadharNumber}
                              onChange={(e) =>
                                  setEditForm({ ...editForm, aadharNumber: e.target.value })
                              }
                              className="w-full border px-3 py-2 rounded-lg"
                          />

                          <textarea
                              placeholder="Address"
                              value={editForm.address}
                              onChange={(e) =>
                                  setEditForm({ ...editForm, address: e.target.value })
                              }
                              className="w-full border px-3 py-2 rounded-lg"
                              rows={3}
                          />

                          <div className="flex justify-end gap-3 pt-2">
                              <button
                                  type="button"
                                  onClick={() => setShowEditModal(false)}
                                  className="px-4 py-2 border rounded-lg"
                              >
                                  Cancel
                              </button>

                              <button
                                  type="submit"
                                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                              >
                                  Save Changes
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          )}
          {showPasswordModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-900">
        Password Reset Successful
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Share this temporary password with the customer securely. It is shown only once.
      </p>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Customer Name</p>
          <div className="w-full border rounded-lg px-3 py-2 bg-gray-50">
            {resetPasswordData.name}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Email</p>
          <div className="w-full border rounded-lg px-3 py-2 bg-gray-50">
            {resetPasswordData.email}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">New Temporary Password</p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={resetPasswordData.password}
              className="flex-1 border rounded-lg px-3 py-2 bg-yellow-50 font-medium text-gray-900"
            />
            <button
              onClick={handleCopyPassword}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => {
            setShowPasswordModal(false);
            setResetPasswordData({
              name: "",
              email: "",
              password: "",
            });
          }}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AgentUserDetails;
