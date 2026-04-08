import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AgentUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:rounded-3xl sm:p-8">
        Loading...
      </div>
    );
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/agent/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

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
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-5 text-white shadow-lg sm:rounded-3xl sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-100 sm:text-sm sm:tracking-widest">
              Customer Profile
            </p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              Customer Details
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-indigo-100 sm:text-base">
              Review customer information, manage account details, and track their
              full loan history.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <button
              onClick={() => setShowEditModal(true)}
              className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 sm:w-auto"
            >
              Edit Customer
            </button>

            <button
              onClick={() => handleResetPassword(data.user._id)}
              className="w-full rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-yellow-300 sm:w-auto"
            >
              Reset Password
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
          <p className="text-sm font-medium text-gray-500">Customer ID</p>
          <h2 className="mt-3 break-words text-2xl font-bold text-indigo-600 sm:text-3xl">
            {data.user.userId || "-"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">Unique customer reference</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
          <p className="text-sm font-medium text-gray-500">Status</p>
          <h2
            className={`mt-3 text-2xl font-bold sm:text-3xl ${
              data.user.isDeleted ? "text-red-500" : "text-green-600"
            }`}
          >
            {data.user.isDeleted ? "Inactive" : "Active"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Current availability for loan processing
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
          <p className="text-sm font-medium text-gray-500">Total Loans</p>
          <h2 className="mt-3 text-2xl font-bold text-blue-600 sm:text-3xl">
            {data.loans.length}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Loans linked to this customer
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.07)] sm:rounded-[30px]">
        <div className="border-b border-indigo-50 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 shadow-sm">
                Customer Profile
              </div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-[30px]">
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-gray-600 md:text-base">
                Customer identity and contact details.
              </p>
            </div>

            <div
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                data.user.isDeleted
                  ? "border border-red-200 bg-red-50 text-red-700"
                  : "border border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {data.user.isDeleted ? "Inactive Customer" : "Active Customer"}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-slate-50/70 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 shadow-sm sm:rounded-[26px] sm:p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700">
                Identity Snapshot
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-indigo-100 bg-white/85 p-4 sm:rounded-3xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                    Customer ID
                  </p>
                  <p className="mt-3 break-words text-xl font-extrabold text-gray-900 sm:text-2xl">
                    {data.user.userId || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white/85 p-4 sm:rounded-3xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                    Full Name
                  </p>
                  <p className="mt-3 break-words text-xl font-extrabold text-gray-900 sm:text-2xl">
                    {data.user.name || "-"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                Core profile information used for customer identification and loan
                servicing.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4 shadow-sm sm:rounded-3xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                  Email
                </p>
                <p className="mt-3 break-words text-base font-bold text-gray-900 sm:text-lg">
                  {data.user.email || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-4 shadow-sm sm:rounded-3xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                  Phone
                </p>
                <p className="mt-3 break-words text-base font-bold text-gray-900 sm:text-lg">
                  {data.user.phone || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-4 shadow-sm sm:rounded-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                PAN
              </p>
              <p className="mt-3 break-all font-mono text-lg font-semibold tracking-[0.08em] text-gray-900 sm:text-xl">
                {data.user.panNumber || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50 p-4 shadow-sm sm:rounded-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                Aadhaar
              </p>
              <p className="mt-3 break-all font-mono text-lg font-semibold tracking-[0.08em] text-gray-900 sm:text-xl">
                {data.user.aadharNumber || "-"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-[26px] sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Address
            </p>
            <p className="mt-3 break-words text-base font-semibold text-gray-900 sm:text-lg">
              {data.user.address || "-"}
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.07)] sm:rounded-[30px]">
        <div className="border-b border-indigo-50 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 shadow-sm">
                Loan Records
              </div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-[30px]">
                Loan History
              </h2>
              <p className="mt-1 text-sm text-gray-600 md:text-base">
                All loan records related to this customer.
              </p>
            </div>

            <div className="w-fit rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {data.loans.length} Loan{data.loans.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-slate-50/70 p-4 sm:p-6">
          {data.loans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center shadow-sm sm:rounded-[26px]">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                📄
              </div>
              <h3 className="text-xl font-semibold text-gray-800">No loans found</h3>
              <p className="mt-2 text-gray-500">
                This customer does not have any loan records yet.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block sm:rounded-[26px]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead className="bg-slate-50/80">
                      <tr className="text-sm text-gray-500">
                        <th className="px-6 py-4 font-semibold">Loan ID</th>
                        <th className="px-6 py-4 font-semibold">Loan Type</th>
                        <th className="px-6 py-4 font-semibold">Amount</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Created</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.loans.map((loan) => (
                        <tr
                          key={loan._id}
                          onClick={() => navigate(`/agent/loans/${loan.loanId}`)}
                          className="cursor-pointer border-t border-gray-100 transition hover:bg-indigo-50/40"
                        >
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-gray-900">{loan.loanId}</p>
                              <p className="mt-1 text-xs text-gray-400">
                                Click to review
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-gray-700">
                            {loan.loanDetails?.loanType || "-"}
                          </td>

                          <td className="px-6 py-5 font-medium text-gray-800">
                            ₹{loan.loanDetails?.amount || 0}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                loan.status === "approved"
                                  ? "border border-green-200 bg-green-100 text-green-700"
                                  : loan.status === "pending"
                                  ? "border border-blue-200 bg-blue-100 text-blue-700"
                                  : loan.status === "draft"
                                  ? "border border-yellow-200 bg-yellow-100 text-yellow-700"
                                  : loan.status === "rejected"
                                  ? "border border-red-200 bg-red-100 text-red-700"
                                  : loan.status === "under_review"
                                  ? "border border-amber-200 bg-amber-100 text-amber-700"
                                  : loan.status === "documents_pending"
                                  ? "border border-orange-200 bg-orange-100 text-orange-700"
                                  : loan.status === "disbursed"
                                  ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
                                  : "border border-gray-200 bg-gray-100 text-gray-700"
                              }`}
                            >
                              {loan.status}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-gray-700">
                            {new Date(loan.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {data.loans.map((loan) => (
                  <div
                    key={loan._id}
                    onClick={() => navigate(`/agent/loans/${loan.loanId}`)}
                    className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:bg-indigo-50/40"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {loan.loanId}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                              loan.status === "approved"
                                ? "border border-green-200 bg-green-100 text-green-700"
                                : loan.status === "pending"
                                ? "border border-blue-200 bg-blue-100 text-blue-700"
                                : loan.status === "draft"
                                ? "border border-yellow-200 bg-yellow-100 text-yellow-700"
                                : loan.status === "rejected"
                                ? "border border-red-200 bg-red-100 text-red-700"
                                : loan.status === "under_review"
                                ? "border border-amber-200 bg-amber-100 text-amber-700"
                                : loan.status === "documents_pending"
                                ? "border border-orange-200 bg-orange-100 text-orange-700"
                                : loan.status === "disbursed"
                                ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
                                : "border border-gray-200 bg-gray-100 text-gray-700"
                            }`}
                          >
                            {loan.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {loan.loanDetails?.loanType || "-"}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          ₹{loan.loanDetails?.amount || 0}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                            Loan Type
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {loan.loanDetails?.loanType || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-8">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 sm:text-sm sm:tracking-widest">
                Edit Customer
              </p>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Update Customer Details
              </h2>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-base"
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-base"
                  required
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-base"
                />

                <input
                  type="text"
                  placeholder="PAN Number"
                  value={editForm.panNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, panNumber: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-base"
                />

                <input
                  type="text"
                  placeholder="Aadhar Number"
                  value={editForm.aadharNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, aadharNumber: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:col-span-2 sm:text-base"
                />

                <textarea
                  placeholder="Address"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:col-span-2 sm:text-base"
                  rows={4}
                />
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-full rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-8">
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-600 sm:text-sm sm:tracking-widest">
                Password Reset
              </p>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Password Reset Successful
              </h2>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Share this temporary password securely. It is shown only once.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm text-gray-500">Customer Name</p>
                <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm sm:text-base">
                  {resetPasswordData.name}
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">Email</p>
                <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 break-all text-sm sm:text-base">
                  {resetPasswordData.email}
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">
                  New Temporary Password
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    readOnly
                    value={resetPasswordData.password}
                    className="flex-1 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3 font-medium text-gray-900 outline-none text-sm sm:text-base"
                  />
                  <button
                    onClick={handleCopyPassword}
                    className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 sm:text-base"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setResetPasswordData({
                    name: "",
                    email: "",
                    password: "",
                  });
                }}
                className="w-full rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
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