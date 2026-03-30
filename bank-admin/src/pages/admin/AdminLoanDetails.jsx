import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLoanDetails = () => {
  const { loanId } = useParams();
  const { token } = useAuth();

  const [loan, setLoan] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedLoan, setEditedLoan] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignMessage, setAssignMessage] = useState("");
  const [assignError, setAssignError] = useState("");

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchLoan();
    fetchAgents();
  }, [loanId, token]);

  const fetchLoan = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/loans/${loanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setLoan(null);
        setEditedLoan(null);
        return;
      }

      const data = await res.json();
      setLoan(data);
      setEditedLoan(data);
      setSelectedAgent(data.agentId?._id || "");
      setSelectedStatus(data.status || "");
    } catch (error) {
      console.error(error);
      setLoan(null);
      setEditedLoan(null);
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
      setAgents([]);
    }
  };

  const handleSave = async () => {
    try {
      const sections = [
        { section: "loanDetails", data: editedLoan.loanDetails },
        { section: "employmentDetails", data: editedLoan.employmentDetails },
        { section: "kycDetails", data: editedLoan.kycDetails },
      ];

      for (const payload of sections) {
        const res = await fetch(`http://localhost:5000/api/loans/${loan.loanId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `Failed to update ${payload.section}`);
        }
      }

      setEditing(false);
      await fetchLoan();
      alert("Loan updated successfully");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update loan");
    }
  };

  const handleCancel = () => {
    setEditedLoan(loan);
    setEditing(false);
  };

  const handleAssignAgent = async () => {
    if (!selectedAgent) {
      setAssignError("Please select an agent");
      return;
    }

    try {
      setAssigning(true);
      setAssignError("");
      setAssignMessage("");

      const res = await fetch(
        `http://localhost:5000/api/admin/loans/${loan.loanId}/assign-agent`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ agentId: selectedAgent }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to assign agent");
      }

      setAssignMessage("Agent assigned successfully");
      await fetchLoan();
    } catch (error) {
      console.error(error);
      setAssignError(error.message || "Something went wrong");
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateStatus = async () => {
  if (!selectedStatus) {
    setStatusError("Please select a status");
    return;
  }

  if (!statusNote.trim()) {
    setStatusError("Please enter a note before updating the status");
    return;
  }

  try {
    setStatusUpdating(true);
    setStatusError("");
    setStatusMessage("");

    const res = await fetch(
      `http://localhost:5000/api/admin/loans/${loan.loanId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: selectedStatus,
          note: statusNote.trim(),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update status");
    }

    setStatusMessage("Loan status updated successfully");
    setStatusNote("");
    setSelectedStatus("");
    await fetchLoan();
  } catch (error) {
    console.error(error);
    setStatusError(error.message || "Something went wrong");
  } finally {
    setStatusUpdating(false);
  }
};

  const getStatusClasses = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "under_review":
        return "bg-yellow-100 text-yellow-700";
      case "documents_pending":
        return "bg-orange-100 text-orange-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "disbursed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "submitted":
        return "Submitted";
      case "under_review":
        return "Under Review";
      case "documents_pending":
        return "Documents Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "disbursed":
        return "Disbursed";
      case "pending":
        return "Pending";
      default:
        return status || "-";
    }
  };

  const timelineHistory =
    loan?.statusHistory?.length > 0
      ? loan.statusHistory
      : loan
      ? [
          {
            status: loan.status,
            note: "Current loan status",
            changedAt: loan.updatedAt || loan.createdAt,
          },
        ]
      : [];

  const getEffectiveStatus = (status) => {
  if (status === "pending") return "submitted";
  if (status === "modified") return "documents_pending";
  return status;
};

const getLoanStages = (status) => {
  const effectiveStatus = getEffectiveStatus(status);

  const baseStages = [
    { key: "draft", label: "Draft" },
    { key: "submitted", label: "Submitted" },
    { key: "under_review", label: "Under Review" },
    { key: "documents_pending", label: "Documents Pending" },
  ];

  if (effectiveStatus === "rejected") {
    return [...baseStages, { key: "rejected", label: "Rejected" }];
  }

  return [
    ...baseStages,
    { key: "approved", label: "Approved" },
    { key: "disbursed", label: "Disbursed" },
  ];
};

const currentStatus = getEffectiveStatus(loan?.status);
const loanStages = getLoanStages(currentStatus);

const currentStageIndex = loanStages.findIndex(
  (stage) => stage.key === currentStatus
);

const fullTimeline = loanStages.map((stage, index) => {
  const historyItem = timelineHistory.find(
    (item) => getEffectiveStatus(item.status) === stage.key
  );

  let state = "upcoming";

  if (index < currentStageIndex) {
    state = "completed";
  } else if (index === currentStageIndex) {
    state = "current";
  }

  return {
    ...stage,
    state,
    note: historyItem?.note || "",
    changedAt: historyItem?.changedAt || "",
    changedBy: historyItem?.changedBy || null,
  };
});

const getHorizontalStageClasses = (state) => {
  if (state === "completed") {
    return "border-green-200 bg-green-50 text-green-700";
  }
  if (state === "current") {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }
  return "border-gray-200 bg-white text-gray-500";
};

const getHorizontalDotClasses = (state, key) => {
  if (state === "completed") return "bg-green-500";
  if (state === "upcoming") return "bg-gray-300";

  switch (key) {
    case "draft":
      return "bg-gray-500";
    case "submitted":
      return "bg-blue-500";
    case "under_review":
      return "bg-yellow-500";
    case "documents_pending":
      return "bg-orange-500";
    case "approved":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    case "disbursed":
      return "bg-emerald-500";
    default:
      return "bg-gray-500";
  }
};

const getConnectorClasses = (index) => {
  return index < currentStageIndex ? "bg-green-400" : "bg-gray-200";
};

  if (!loan || !editedLoan) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Admin Loan Details
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">
              Loan Details - {loan.loanId}
            </h1>
            <p className="mt-3 max-w-2xl text-indigo-100">
              Review loan information, assign an agent, inspect uploaded
              documents, and update loan records.
            </p>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
            >
              Edit Loan
            </button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                className="rounded-xl bg-green-500 px-5 py-3 font-medium text-white transition hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="rounded-xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Status</p>
          <div className="mt-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                loan.status
              )}`}
            >
              {getStatusLabel(loan.status)}
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Created</p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {new Date(loan.createdAt).toLocaleDateString()}
          </h3>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Assigned Agent</p>
          <h3 className="mt-2 text-2xl font-bold text-indigo-600">
            {loan.agentId?.name || "Unassigned"}
          </h3>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Last Modified By</p>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">
            {loan.lastModifiedBy
              ? `${loan.lastModifiedBy.name} (${loan.lastModifiedBy.role})`
              : "—"}
          </h3>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-gray-900">Assign Agent</h2>
          <p className="mt-1 text-gray-500">
            Assign or change the current handling agent for this loan.
          </p>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Current Assigned Agent:{" "}
          <span className="font-medium text-gray-900">
            {loan.agentId?.name || "Unassigned"}
          </span>
        </p>

        {assignError && (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {assignError}
          </div>
        )}

        {assignMessage && (
          <div className="mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {assignMessage}
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500 md:w-80"
          >
            <option value="">Select Agent</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name} ({agent.agentId})
              </option>
            ))}
          </select>

          <button
            onClick={handleAssignAgent}
            disabled={assigning}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {assigning
              ? "Saving..."
              : loan.agentId
              ? "Change Agent"
              : "Assign Agent"}
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-gray-900">
            Loan Status Management
          </h2>
          <p className="mt-1 text-gray-500">
            Update the loan processing stage and add an internal note for the
            timeline.
          </p>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Current Status:{" "}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
              loan.status
            )}`}
          >
            {getStatusLabel(loan.status)}
          </span>
        </p>

        {statusError && (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {statusError}
          </div>
        )}

        {statusMessage && (
          <div className="mb-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
            >
              <option value="">Select Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="documents_pending">
                Documents Pending 
              </option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected </option>
              <option value="disbursed">Disbursed </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Note <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Enter reason / note for this status update"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleUpdateStatus}
            disabled={statusUpdating}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {statusUpdating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </section>

      {!editing && (
        <>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-2xl font-semibold text-gray-900">Loan Timeline</h2>
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
        loan?.status
      )}`}
    >
      {getStatusLabel(loan?.status)}
    </span>
  </div>

  <div className="overflow-x-auto">
    <div className="min-w-[950px]">
      <div className="relative flex items-start justify-between px-4 pt-6">
        {fullTimeline.map((item, index) => (
          <div
            key={item.key}
            className="relative flex flex-1 flex-col items-center"
          >
            {index !== fullTimeline.length - 1 && (
              <div
                className={`absolute left-1/2 top-[18px] h-1 w-full ${getConnectorClasses(
                  index
                )}`}
              ></div>
            )}

            <div
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-sm ${getHorizontalDotClasses(
                item.state,
                item.key
              )}`}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
            </div>

            <div
              className={`mt-4 w-[150px] rounded-2xl border p-4 text-center ${getHorizontalStageClasses(
                item.state
              )}`}
            >
              <h3 className="text-sm font-semibold leading-5">{item.label}</h3>

              <p className="mt-2 text-xs font-medium">
                {item.state === "completed" && "Completed"}
                {item.state === "current" && "Current Stage"}
                {item.state === "upcoming" && "Upcoming"}
              </p>

              <p className="mt-2 min-h-[32px] text-[11px] leading-4 text-gray-500">
                {item.note || "—"}
              </p>

              <p className="mt-2 text-[11px] text-gray-400">
                {item.changedAt
                  ? new Date(item.changedAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

          {loan.loanDetails && (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-gray-900">
                Loan Details
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    ₹{loan.loanDetails?.amount || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {loan.loanDetails?.interestRate
                      ? `${loan.loanDetails.interestRate}%`
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Tenure</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {loan.loanDetails?.tenure
                      ? `${loan.loanDetails.tenure} months`
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Loan Type</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {loan.loanDetails?.loanType || "-"}
                  </p>
                </div>
              </div>
            </section>
          )}

          {loan.employmentDetails && (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-gray-900">
                Employment Details
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {loan.employmentDetails?.companyName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {loan.employmentDetails?.location || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    ₹{loan.employmentDetails?.salary || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Net Salary</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    ₹{loan.employmentDetails?.netsalary || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Job Title</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {loan.employmentDetails?.jobTitle || "-"}
                  </p>
                </div>
              </div>
            </section>
          )}

          {loan.kycDetails && (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-gray-900">
                KYC Details
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Aadhaar</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {loan.kycDetails?.aadharNumber || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">PAN</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {loan.kycDetails?.panNumber || "-"}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {loan.kycDetails?.address || "-"}
                  </p>
                </div>
              </div>
            </section>
          )}

          {loan.kycDetails && (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-gray-900">
                Uploaded Documents
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="mb-2 font-medium text-gray-800">PAN Card</p>
                  {loan.kycDetails?.panFile ? (
                    <a
                      href={loan.kycDetails.panFile}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      View PAN Card
                    </a>
                  ) : (
                    <p className="text-sm text-red-500">Not uploaded</p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="mb-2 font-medium text-gray-800">Aadhaar Card</p>
                  {loan.kycDetails?.aadhaarFile ? (
                    <a
                      href={loan.kycDetails.aadhaarFile}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      View Aadhaar Card
                    </a>
                  ) : (
                    <p className="text-sm text-red-500">Not uploaded</p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="mb-2 font-medium text-gray-800">Bank Statements</p>
                  {loan.kycDetails?.bankStatements?.length > 0 ? (
                    <div className="space-y-2">
                      {loan.kycDetails.bankStatements.map((file, index) => (
                        <a
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-indigo-600 hover:underline"
                        >
                          View Bank Statement {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">Not uploaded</p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="mb-2 font-medium text-gray-800">IT Returns</p>
                  {loan.kycDetails?.itReturns?.length > 0 ? (
                    <div className="space-y-2">
                      {loan.kycDetails.itReturns.map((file, index) => (
                        <a
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-indigo-600 hover:underline"
                        >
                          View IT Return {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">Not uploaded</p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="mb-2 font-medium text-gray-800">Payslips</p>
                  {loan.kycDetails?.payslips?.length > 0 ? (
                    <div className="space-y-2">
                      {loan.kycDetails.payslips.map((file, index) => (
                        <a
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-indigo-600 hover:underline"
                        >
                          View Payslip {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">Not uploaded</p>
                  )}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {editing && (
        <>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
              Loan Details
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm text-gray-500">Amount</p>
                <input
                  type="number"
                  value={editedLoan?.loanDetails?.amount || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      loanDetails: {
                        ...editedLoan.loanDetails,
                        amount: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">Interest Rate (%)</p>
                <input
                  type="number"
                  value={editedLoan?.loanDetails?.interestRate || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      loanDetails: {
                        ...editedLoan.loanDetails,
                        interestRate: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">Tenure (months)</p>
                <input
                  type="number"
                  value={editedLoan?.loanDetails?.tenure || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      loanDetails: {
                        ...editedLoan.loanDetails,
                        tenure: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">Loan Type</p>
                <select
                  value={editedLoan?.loanDetails?.loanType || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      loanDetails: {
                        ...editedLoan.loanDetails,
                        loanType: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                >
                  <option value="">Select Loan Type</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Education Loan">Education Loan</option>
                  <option value="Vehicle Loan">Vehicle Loan</option>
                  <option value="Business Loan">Business Loan</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
              Employment Details
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm text-gray-500">Company Name</p>
                <input
                  type="text"
                  value={editedLoan?.employmentDetails?.companyName || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      employmentDetails: {
                        ...editedLoan.employmentDetails,
                        companyName: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">Job Title</p>
                <input
                  type="text"
                  value={editedLoan?.employmentDetails?.jobTitle || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      employmentDetails: {
                        ...editedLoan.employmentDetails,
                        jobTitle: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">Location</p>
                <input
                  type="text"
                  value={editedLoan?.employmentDetails?.location || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      employmentDetails: {
                        ...editedLoan.employmentDetails,
                        location: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">Salary</p>
                <input
                  type="number"
                  value={editedLoan?.employmentDetails?.salary || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      employmentDetails: {
                        ...editedLoan.employmentDetails,
                        salary: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">Net Salary</p>
                <input
                  type="number"
                  value={editedLoan?.employmentDetails?.netsalary || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      employmentDetails: {
                        ...editedLoan.employmentDetails,
                        netsalary: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
              KYC Details
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm text-gray-500">Aadhaar Number</p>
                <input
                  type="text"
                  value={editedLoan?.kycDetails?.aadharNumber || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      kycDetails: {
                        ...editedLoan.kycDetails,
                        aadharNumber: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">PAN Number</p>
                <input
                  type="text"
                  value={editedLoan?.kycDetails?.panNumber || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      kycDetails: {
                        ...editedLoan.kycDetails,
                        panNumber: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <p className="mb-1 text-sm text-gray-500">Address</p>
                <input
                  type="text"
                  value={editedLoan?.kycDetails?.address || ""}
                  onChange={(e) =>
                    setEditedLoan({
                      ...editedLoan,
                      kycDetails: {
                        ...editedLoan.kycDetails,
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminLoanDetails;