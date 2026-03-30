import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const MyLoanDetails = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLoanDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/user/my-loans/${loanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Request failed with status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch loan details");
      }

      setLoan(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanDetails();
  }, [loanId]);

  const getEffectiveStatus = (status) => {
    if (status === "pending") return "submitted";
    if (status === "modified") return "documents_pending";
    return status;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "under_review":
        return "bg-orange-100 text-orange-700";
      case "documents_pending":
        return "bg-purple-100 text-purple-700";
      case "disbursed":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getCustomerStatusLabel = (status) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "submitted":
        return "Application Submitted";
      case "under_review":
        return "Under Review";
      case "documents_pending":
        return "Documents Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "disbursed":
        return "Amount Disbursed";
      case "pending":
        return "Application Submitted";
      default:
        return status || "-";
    }
  };

  const getCustomerStatusMessage = (status) => {
    switch (status) {
      case "draft":
        return "Your application is still in draft. You can review and complete it before submission.";
      case "submitted":
        return "We’ve received your loan application and it is waiting for review.";
      case "under_review":
        return "Your loan application is currently being reviewed by our team.";
      case "documents_pending":
        return "We need some additional documents or corrections to continue processing your application.";
      case "approved":
        return "Good news — your loan application has been approved.";
      case "rejected":
        return "Your application is rejected due to invalid details/documents.";
      case "disbursed":
        return "Your approved loan amount has been released successfully.";
      default:
        return "Track the latest progress of your loan application here.";
    }
  };

  const timelineHistory =
    loan?.statusHistory?.length > 0
      ? loan.statusHistory
      : loan
      ? [
          {
            status: loan.status,
            note: "Current application status",
            changedAt: loan.updatedAt || loan.createdAt,
          },
        ]
      : [];

  const getCustomerStages = (status) => {
    const effectiveStatus = getEffectiveStatus(status);

    const baseStages = [
      { key: "submitted", label: "Submitted" },
      { key: "under_review", label: "Under Review" },
      { key: "documents_pending", label: "Documents Pending" },
    ];

    if (effectiveStatus === "draft") {
      return [
        { key: "draft", label: "Draft" },
        ...baseStages,
        { key: "approved", label: "Approved" },
      ];
    }

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
  const customerStages = getCustomerStages(currentStatus);

  const currentStageIndex = customerStages.findIndex(
    (stage) => stage.key === currentStatus
  );

  const progressStages = customerStages.map((stage, index) => {
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

  const getTimelineDotClasses = (state, key) => {
    if (state === "completed") return "bg-blue-700 border-blue-700";
    if (state === "upcoming") return "bg-white border-gray-300";

    switch (key) {
      case "draft":
        return "bg-gray-500 border-gray-500";
      case "submitted":
        return "bg-blue-600 border-blue-600";
      case "under_review":
        return "bg-orange-500 border-orange-500";
      case "documents_pending":
        return "bg-purple-500 border-purple-500";
      case "approved":
        return "bg-green-600 border-green-600";
      case "rejected":
        return "bg-red-500 border-red-500";
      case "disbursed":
        return "bg-emerald-600 border-emerald-600";
      default:
        return "bg-blue-600 border-blue-600";
    }
  };

  const canEdit =
    loan && ["draft", "documents_pending"].includes(loan.status);

  const latestUpdate =
    timelineHistory.length > 0
      ? timelineHistory[timelineHistory.length - 1]
      : null;

  const panFileUrl =
  loan?.kycDetails?.panFile || loan?.userDocuments?.panCard?.url || "";

const aadhaarFileUrl =
  loan?.kycDetails?.aadhaarFile || loan?.userDocuments?.aadharCard?.url || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
              Loan Details
            </p>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              My Loan Details
            </h1>
            <p className="mt-3 text-gray-600">
              View complete details of your loan application.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/user/my-applications"
              className="inline-block rounded-xl border border-blue-900 px-5 py-2.5 font-medium text-blue-900 transition hover:bg-blue-50"
            >
              Back to Applications
            </Link>

            {canEdit && (
              <Link
                to={`/user/my-applications/${loan.loanId}/edit`}
                className="inline-block rounded-xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800"
              >
                Edit Loan
              </Link>
            )}
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
            Loading loan details...
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && loan && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {loan.loanDetails?.loanType || "Loan"}
                  </h2>
                  <p className="mt-1 text-gray-600">Loan ID: {loan.loanId}</p>
                </div>

                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${getStatusStyle(
                    loan.status
                  )}`}
                >
                  {getCustomerStatusLabel(loan.status)}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    ₹{loan.loanDetails?.amount || 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {loan.loanDetails?.interestRate || "N/A"}%
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Tenure</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {loan.loanDetails?.tenure || "N/A"} months
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {loan.createdAt
                      ? new Date(loan.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 rounded-3xl bg-white p-6 shadow-sm">
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
                  Application Progress
                </p>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {getCustomerStatusLabel(loan.status)}
                </h3>
                <p className="mt-2 max-w-3xl text-gray-600">
                  {getCustomerStatusMessage(loan.status)}
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
                  Latest Update
                </p>
                <p className="mt-3 text-base font-medium text-blue-900">
                  {latestUpdate?.note || "Your application status has been updated."}
                </p>
                {latestUpdate?.changedAt && (
                  <p className="mt-2 text-sm text-blue-700">
                    {new Date(latestUpdate.changedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[760px] px-2 pt-2">
                  <div className="relative flex items-start justify-between">
                    {progressStages.map((item, index) => (
                      <div
                        key={item.key}
                        className="relative flex flex-1 flex-col items-center"
                      >
                        {index !== progressStages.length - 1 && (
                          <div
                            className={`absolute left-1/2 top-[16px] h-1 w-full ${
                              index < currentStageIndex ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          ></div>
                        )}

                        <div
                          className={`relative z-10 h-8 w-8 rounded-full border-4 border-white ${getTimelineDotClasses(
                            item.state,
                            item.key
                          )}`}
                        ></div>

                        <div className="mt-4 text-center">
                          <p className="text-sm font-semibold text-gray-900">
                            {item.label}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {item.state === "completed" && "Completed"}
                            {item.state === "current" && "Current Step"}
                            {item.state === "upcoming" && "Upcoming"}
                          </p>

                          {item.changedAt && (
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(item.changedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                  Current Status
                </p>
                <p className="mt-3 text-lg font-semibold text-gray-900">
                  {getCustomerStatusLabel(loan.status)}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {getCustomerStatusMessage(loan.status)}
                </p>
              </div>

              {loan.status === "documents_pending" && (
                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-widest text-purple-700">
                    Action Needed
                  </p>
                  <p className="mt-3 text-sm leading-6 text-purple-800">
                    Your application needs updated details or additional
                    documents. Please use the edit option to make the required
                    changes and continue the process.
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-blue-900">
                  Employment Details
                </h3>

                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-semibold">Company Name:</span>{" "}
                    {loan.employmentDetails?.companyName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Company ID:</span>{" "}
                    {loan.employmentDetails?.companyId || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {loan.employmentDetails?.location || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Salary:</span>{" "}
                    ₹{loan.employmentDetails?.salary || 0}
                  </p>
                  <p>
                    <span className="font-semibold">Net Hand Salary:</span>{" "}
                    ₹{loan.employmentDetails?.netHandSalary || 0}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-blue-900">
                  KYC Details
                </h3>

                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-semibold">PAN Number:</span>{" "}
                    {loan.kycDetails?.panNumber || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Aadhaar Number:</span>{" "}
                    {loan.kycDetails?.aadharNumber || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {loan.kycDetails?.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-blue-900">
                Uploaded Documents
              </h3>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="mb-2 font-semibold text-gray-900">PAN Card</p>
                  {panFileUrl ? (
                    <a
                      href={loan.kycDetails.panFile}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      View PAN Card
                    </a>
                  ) : (
                    <p className="text-red-500">Not uploaded</p>
                  )}
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="mb-2 font-semibold text-gray-900">Aadhaar Card</p>
                  {aadhaarFileUrl ? (
                    <a
                      href={loan.kycDetails.aadhaarFile}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      View Aadhaar Card
                    </a>
                  ) : (
                    <p className="text-red-500">Not uploaded</p>
                  )}
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="mb-2 font-semibold text-gray-900">
                    Bank Statements
                  </p>
                  {loan.kycDetails?.bankStatements?.length > 0 ? (
                    <div className="space-y-2">
                      {loan.kycDetails.bankStatements.map((file, index) => (
                        <a
                          key={index}
                          href={loan.kycDetails.bankStatements[index]}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-blue-700 hover:underline"
                        >
                          View Bank Statement {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-500">Not uploaded</p>
                  )}
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="mb-2 font-semibold text-gray-900">IT Returns</p>
                  {loan.kycDetails?.itReturns?.length > 0 ? (
                    <div className="space-y-2">
                      {loan.kycDetails.itReturns.map((file, index) => (
                        <a
                          key={index}
                          href={loan.kycDetails.itReturns[index]}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-blue-700 hover:underline"
                        >
                          View IT Return {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-500">Not uploaded</p>
                  )}
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="mb-2 font-semibold text-gray-900">Payslips</p>
                  {loan.kycDetails?.payslips?.length > 0 ? (
                    <div className="space-y-2">
                      {loan.kycDetails.payslips.map((file, index) => (
                        <a
                          key={index}
                          href={loan.kycDetails.payslips[index]}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-blue-700 hover:underline"
                        >
                          View Payslip {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-500">Not uploaded</p>
                  )}
                </div>
              </div>
            </div>

            {loan.remarks && (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-semibold text-blue-900">
                  Remarks
                </h3>
                <div className="rounded-2xl bg-gray-50 p-4 text-gray-700">
                  {loan.remarks}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoanDetails;