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
  <div className="space-y-8">
    <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
            Customer Profile
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">Customer Details</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            Review customer information, manage account details, and track their
            full loan history.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="rounded-2xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
          >
            Edit Customer
          </button>

          <button
            onClick={() => handleResetPassword(data.user._id)}
            className="rounded-2xl bg-yellow-400 px-5 py-3 font-medium text-gray-900 transition hover:bg-yellow-300"
          >
            Reset Password
          </button>
        </div>
      </div>
    </section>

    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Customer ID</p>
        <h2 className="mt-3 text-3xl font-bold text-indigo-600">
          {data.user.userId || "-"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">Unique customer reference</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Status</p>
        <h2
          className={`mt-3 text-3xl font-bold ${
            data.user.isDeleted ? "text-red-500" : "text-green-600"
          }`}
        >
          {data.user.isDeleted ? "Inactive" : "Active"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Current availability for loan processing
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Total Loans</p>
        <h2 className="mt-3 text-3xl font-bold text-blue-600">
          {data.loans.length}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Loans linked to this customer
        </p>
      </div>
    </section>

    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Profile Information
          </h2>
          <p className="mt-1 text-gray-500">
            Customer identity and contact details.
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            data.user.isDeleted
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {data.user.isDeleted ? "Inactive Customer" : "Active Customer"}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="mb-2 text-sm text-gray-500">Customer ID</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.user.userId || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="mb-2 text-sm text-gray-500">Name</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.user.name || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="mb-2 text-sm text-gray-500">Email</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.user.email || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="mb-2 text-sm text-gray-500">Phone</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.user.phone || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="mb-2 text-sm text-gray-500">PAN</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.user.panNumber || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <p className="mb-2 text-sm text-gray-500">Aadhar</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.user.aadharNumber || "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-50 p-5 md:col-span-2 xl:col-span-3">
          <p className="mb-2 text-sm text-gray-500">Address</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.user.address || "-"}
          </p>
        </div>
      </div>
    </section>

    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Loan History</h2>
          <p className="mt-1 text-gray-500">
            All loan records related to this customer.
          </p>
        </div>
      </div>

      {data.loans.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-14 text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            No loans found
          </h3>
          <p className="mt-2 text-gray-500">
            This customer does not have any loan records yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-4 font-semibold">Loan ID</th>
                <th className="pb-4 font-semibold">Loan Type</th>
                <th className="pb-4 font-semibold">Amount</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold">Created</th>
              </tr>
            </thead>

            <tbody>
              {data.loans.map((loan) => (
                <tr
                  key={loan._id}
                  className="border-b border-gray-50 transition hover:bg-gray-50"
                >
                  <td className="py-5 font-semibold text-gray-900">
                    {loan.loanId}
                  </td>

                  <td className="py-5 text-gray-700">
                    {loan.loanDetails?.loanType || "-"}
                  </td>

                  <td className="py-5 text-gray-800">
                    ₹{loan.loanDetails?.amount || 0}
                  </td>

                  <td className="py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

                  <td className="py-5 text-gray-700">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>

    {showEditModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Edit Customer
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Update Customer Details
            </h2>
            <p className="mt-2 text-gray-500">
              Edit the customer information below and save your changes.
            </p>
          </div>

          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                required
              />

              <input
                type="text"
                placeholder="Phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <input
                type="text"
                placeholder="PAN Number"
                value={editForm.panNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, panNumber: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <input
                type="text"
                placeholder="Aadhar Number"
                value={editForm.aadharNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, aadharNumber: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:col-span-2"
              />

              <textarea
                placeholder="Address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:col-span-2"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    {showPasswordModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-yellow-600">
              Password Reset
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Password Reset Successful
            </h2>
            <p className="mt-2 text-gray-500">
              Share this temporary password securely. It is shown only once.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm text-gray-500">Customer Name</p>
              <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
                {resetPasswordData.name}
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm text-gray-500">Email</p>
              <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
                {resetPasswordData.email}
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm text-gray-500">
                New Temporary Password
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={resetPasswordData.password}
                  className="flex-1 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 font-medium text-gray-900 outline-none"
                />
                <button
                  onClick={handleCopyPassword}
                  className="rounded-xl bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setResetPasswordData({
                  name: "",
                  email: "",
                  password: "",
                });
              }}
              className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
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
