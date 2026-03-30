import React, { useState } from "react";

const ReviewSubmit = ({ loanData, status, onUpdateStatus, statusUpdating }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  const headingText =
    status === "approved"
      ? "Approved Loan Summary"
      : status === "rejected"
      ? "Rejected Loan Summary"
      : "Review & Submit";

  const subText =
    status === "approved"
      ? "This loan has been approved. Review the final submitted details below."
      : status === "rejected"
      ? "This loan has been rejected. Review the submitted details below."
      : "Please review all loan details carefully before submitting.";

  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === "") return "—";
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const formatText = (value) => {
    if (!value && value !== 0) return "—";
    return value;
  };

  const formatLoanType = (value) => {
    if (!value) return "—";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const getStatusClasses = (statusValue) => {
    switch (statusValue) {
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

  const getStatusLabel = (statusValue) => {
    switch (statusValue) {
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
        return statusValue || "Draft";
    }
  };

  const getEffectiveStatus = (statusValue) => {
    if (statusValue === "pending") return "submitted";
    if (statusValue === "modified") return "documents_pending";
    return statusValue;
  };

  const timelineHistory =
    loanData?.statusHistory?.length > 0
      ? loanData.statusHistory
      : loanData
      ? [
          {
            status: loanData.status,
            note: "Current loan status",
            changedAt: loanData.updatedAt || loanData.createdAt,
          },
        ]
      : [];

  const getLoanStages = (statusValue) => {
    const effectiveStatus = getEffectiveStatus(statusValue);

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

  const currentStatus = getEffectiveStatus(loanData?.status);
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

  const DetailItem = ({ label, value }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="break-words text-base font-medium text-gray-900">{value}</p>
    </div>
  );

  const handleStatusUpdateClick = () => {
    onUpdateStatus(selectedStatus, statusNote);
    setSelectedStatus("");
    setStatusNote("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Final Review
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">{headingText}</h2>
            <p className="mt-3 max-w-2xl text-indigo-100">{subText}</p>
          </div>

          <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-100">
              Current Status
            </p>
            <p className="mt-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(
                  loanData?.status
                )}`}
              >
                {getStatusLabel(loanData?.status)}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-gray-900">Loan Timeline</h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
              loanData?.status
            )}`}
          >
            {getStatusLabel(loanData?.status)}
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

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-2xl font-semibold text-gray-900">
            Status Management
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Update loan status after reviewing documents and customer details.
          </p>
        </div>

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
              <option value="rejected">Rejected</option>
              <option value="disbursed">Disbursed</option>
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
            onClick={handleStatusUpdateClick}
            disabled={statusUpdating || !selectedStatus || !statusNote.trim()}
            className="rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {statusUpdating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </section>

      <div className="grid gap-8">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Loan Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Summary of selected loan information
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl text-indigo-600">
              💰
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailItem
              label="Amount"
              value={formatCurrency(loanData.loanDetails?.amount)}
            />
            <DetailItem
              label="Loan Type"
              value={formatLoanType(loanData.loanDetails?.loanType)}
            />
            <DetailItem
              label="Tenure"
              value={
                loanData.loanDetails?.tenure
                  ? `${loanData.loanDetails.tenure} months`
                  : "—"
              }
            />
            <DetailItem
              label="Interest Rate"
              value={
                loanData.loanDetails?.interestRate ||
                loanData.loanDetails?.intrestRate
                  ? `${loanData.loanDetails?.interestRate || loanData.loanDetails?.intrestRate}%`
                  : "—"
              }
            />
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Employment Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Applicant work and income information
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
              💼
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <DetailItem
              label="Company Name"
              value={formatText(loanData.employmentDetails?.companyName)}
            />
            <DetailItem
              label="Job Title"
              value={formatText(loanData.employmentDetails?.jobTitle)}
            />
            <DetailItem
              label="Location"
              value={formatText(loanData.employmentDetails?.location)}
            />
            <DetailItem
              label="Salary"
              value={formatCurrency(loanData.employmentDetails?.salary)}
            />
            <DetailItem
              label="Net Hand Salary"
              value={formatCurrency(loanData.employmentDetails?.netHandSalary)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                KYC Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Identity and address information
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl text-green-600">
              🪪
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <DetailItem
              label="Aadhar Number"
              value={formatText(loanData.kycDetails?.aadharNumber)}
            />
            <DetailItem
              label="PAN Number"
              value={formatText(loanData.kycDetails?.panNumber)}
            />
            <div className="md:col-span-2 xl:col-span-1">
              <DetailItem
                label="Address"
                value={formatText(loanData.kycDetails?.address)}
              />
            </div>
          </div>
        </section>

        {loanData?.kycDetails && (
          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  Uploaded Documents
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Customer submitted files for verification
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl text-purple-600">
                📄
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="mb-3 text-sm font-medium text-gray-500">PAN Card</p>
                {loanData.kycDetails?.panFile ? (
                  <a
                    href={loanData.kycDetails.panFile}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    View PAN Card
                  </a>
                ) : (
                  <p className="text-sm text-red-500">Not uploaded</p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="mb-3 text-sm font-medium text-gray-500">
                  Aadhaar Card
                </p>
                {loanData.kycDetails?.aadhaarFile ? (
                  <a
                    href={loanData.kycDetails.aadhaarFile}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    View Aadhaar Card
                  </a>
                ) : (
                  <p className="text-sm text-red-500">Not uploaded</p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="mb-3 text-sm font-medium text-gray-500">
                  Bank Statements
                </p>
                {loanData.kycDetails?.bankStatements?.length > 0 ? (
                  <div className="space-y-2">
                    {loanData.kycDetails.bankStatements.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noreferrer"
                        className="block font-medium text-indigo-600 hover:underline"
                      >
                        View Bank Statement {index + 1}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-red-500">Not uploaded</p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <p className="mb-3 text-sm font-medium text-gray-500">
                  IT Returns
                </p>
                {loanData.kycDetails?.itReturns?.length > 0 ? (
                  <div className="space-y-2">
                    {loanData.kycDetails.itReturns.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noreferrer"
                        className="block font-medium text-indigo-600 hover:underline"
                      >
                        View IT Return {index + 1}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-red-500">Not uploaded</p>
                )}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 md:col-span-2 xl:col-span-1">
                <p className="mb-3 text-sm font-medium text-gray-500">
                  Payslips
                </p>
                {loanData.kycDetails?.payslips?.length > 0 ? (
                  <div className="space-y-2">
                    {loanData.kycDetails.payslips.map((file, index) => (
                      <a
                        key={index}
                        href={file}
                        target="_blank"
                        rel="noreferrer"
                        className="block font-medium text-indigo-600 hover:underline"
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
      </div>
    </div>
  );
};

export default ReviewSubmit;