import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const SectionCard = ({ badge, title, subtitle, icon, children }) => (
  <section className="overflow-hidden rounded-[30px] border border-gray-100 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.07)]">
    <div className="border-b border-indigo-50 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-6 py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 shadow-sm">
            {badge}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-[30px]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-gray-600 md:text-base">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-blue-100 bg-white/80 text-2xl shadow-sm">
          {icon}
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-b from-white to-slate-50/70 p-6">
      {children}
    </div>
  </section>
);

const DocumentCard = ({ title, links, emptyText }) => {
  const count = Array.isArray(links) ? links.length : 0;

  return (
    <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
            📄
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {count > 0
                ? `${count} file${count > 1 ? "s" : ""} available`
                : emptyText}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            count > 0
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {count > 0 ? "Uploaded" : "Missing"}
        </span>
      </div>

      {count > 0 ? (
        <div className="space-y-2">
          {links.map((file, index) => (
            <a
              key={index}
              href={file}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <span>
                {title} {count > 1 ? index + 1 : ""}
              </span>
              <span>Open ↗</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm font-medium text-red-500">{emptyText}</p>
      )}
    </div>
  );
};

const DetailItem = ({ label, value, tone = "default" }) => {
  const toneClasses = {
    default: "border-gray-200 bg-white",
    blue: "border-blue-100 bg-gradient-to-br from-white to-blue-50",
    emerald: "border-emerald-100 bg-gradient-to-br from-white to-emerald-50",
    amber: "border-amber-100 bg-gradient-to-br from-white to-amber-50",
    violet: "border-violet-100 bg-gradient-to-br from-white to-violet-50",
  };

  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${toneClasses[tone]}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>
      <p className="mt-3 break-words text-lg font-bold text-gray-900">
        {value || "—"}
      </p>
    </div>
  );
};

const MyLoanDetails = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("all")

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
    setActiveSection("all");
  }, [loanId]);

  const getEffectiveStatus = (status) => {
    if (status === "pending") return "submitted";
    if (status === "modified") return "documents_pending";
    return status;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "border border-green-200 bg-green-100 text-green-700";
      case "rejected":
        return "border border-red-200 bg-red-100 text-red-700";
      case "draft":
        return "border border-gray-200 bg-gray-100 text-gray-700";
      case "submitted":
        return "border border-blue-200 bg-blue-100 text-blue-700";
      case "under_review":
        return "border border-orange-200 bg-orange-100 text-orange-700";
      case "documents_pending":
        return "border border-purple-200 bg-purple-100 text-purple-700";
      case "disbursed":
        return "border border-emerald-200 bg-emerald-100 text-emerald-700";
      default:
        return "border border-yellow-200 bg-yellow-100 text-yellow-700";
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

  const getStatusAccent = (status) => {
    switch (status) {
      case "draft":
        return "border-l-gray-400";
      case "submitted":
        return "border-l-blue-500";
      case "under_review":
        return "border-l-orange-500";
      case "documents_pending":
        return "border-l-purple-500";
      case "approved":
        return "border-l-green-500";
      case "rejected":
        return "border-l-red-500";
      case "disbursed":
        return "border-l-emerald-500";
      default:
        return "border-l-blue-500";
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
        { key: "disbursed", label: "Disbursed" },
      ];
    }

    if (effectiveStatus === "rejected") {
      return [
        ...baseStages,
        { key: "rejected", label: "Rejected" },
        { key: "disbursed", label: "Disbursed" },
      ];
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

    if (stage.key === currentStatus) {
      state = "current";
    } else if (historyItem) {
      state = "completed";
    } else if (index < currentStageIndex) {
      state = "skipped";
    }

    return {
      ...stage,
      state,
      note: historyItem?.note || "",
      changedAt: historyItem?.changedAt || "",
    };
  });

  const getTimelineDotClasses = (state, key) => {
    if (state === "completed") return "bg-blue-700";
    if (state === "skipped") return "bg-rose-300";
    if (state === "upcoming") return "bg-gray-300";

    switch (key) {
      case "draft":
        return "bg-gray-500";
      case "submitted":
        return "bg-blue-600";
      case "under_review":
        return "bg-orange-500";
      case "documents_pending":
        return "bg-purple-500";
      case "approved":
        return "bg-green-600";
      case "rejected":
        return "bg-red-500";
      case "disbursed":
        return "bg-emerald-600";
      default:
        return "bg-blue-600";
    }
  };

  const getConnectorClasses = (index) => {
    const leftStage = progressStages[index];
    const rightStage = progressStages[index + 1];

    const isActive = (state) => state === "completed" || state === "current";

    return leftStage &&
      rightStage &&
      isActive(leftStage.state) &&
      isActive(rightStage.state)
      ? "bg-blue-600"
      : "bg-gray-200";
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

  const bankStatementLinks = loan?.kycDetails?.bankStatements || [];
  const itReturnLinks = loan?.kycDetails?.itReturns || [];
  const payslipLinks = loan?.kycDetails?.payslips || [];

  const formatCurrency = (value) => `₹${value || 0}`;

  const sectionTabs = [
    { key: "all", label: "All Sections"},
    { key: "progress", label: "Progress"},
    { key: "summary", label: "Summary"},
    { key: "employment", label: "Employment"},
    { key: "kyc", label: "KYC"},
    { key: "documents", label: "Documents"},
     ...(loan?.remarks ? [{ key: "remarks", label: "Remarks" }] : []),
];

const isSectionVisible = (key) =>
  activeSection === "all" || activeSection === key;

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {loading && (
          <div className="rounded-[28px] bg-white p-6 text-gray-600 shadow-sm ring-1 ring-gray-100">
            Loading loan details...
          </div>
        )}

        {error && (
          <div className="rounded-[28px] bg-red-50 p-6 text-red-600 shadow-sm ring-1 ring-red-100">
            {error}
          </div>
        )}

        {!loading && !error && loan && (
          <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-8 py-10 shadow-[0_18px_50px_rgba(59,130,246,0.10)] ring-1 ring-blue-100 md:px-10">
              <div className="absolute inset-0 opacity-60">
                <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />
              </div>

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                    Loan Details
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
                      {loan.loanDetails?.loanType || "Loan"}
                    </h1>
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                        loan.status
                      )}`}
                    >
                      {getCustomerStatusLabel(loan.status)}
                    </span>
                  </div>

                  <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600">
                    {getCustomerStatusMessage(loan.status)}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm">
                      <p className="text-sm text-gray-500">Loan ID</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {loan.loanId}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm">
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {formatCurrency(loan.loanDetails?.amount)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm">
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {loan.createdAt
                          ? new Date(loan.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/user/my-applications"
                    className="inline-block rounded-2xl border border-blue-900 px-5 py-2.5 font-medium text-blue-900 transition hover:bg-blue-50"
                  >
                    Back to Applications
                  </Link>

                  {canEdit && (
                    <Link
                      to={`/user/my-applications/${loan.loanId}/edit`}
                      className="inline-block rounded-2xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800"
                    >
                      Edit Loan
                    </Link>
                  )}
                </div>
              </div>
            </section>

            <div className="rounded-[24px] border border-gray-100 bg-white p-3 shadow-sm ring-1 ring-gray-100">
              <div className="flex flex-wrap gap-2">
                {sectionTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveSection(tab.key)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeSection === tab.key
                        ? "border border-blue-200 bg-blue-50 text-blue-700"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {isSectionVisible("progress") && (
              <SectionCard
              badge="Application Progress"
              title={getCustomerStatusLabel(loan.status)}
              subtitle={getCustomerStatusMessage(loan.status)}
              icon="📍"
              >
              <div className="mb-6 rounded-[24px] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  Latest Update
                </p>
                <p className="mt-3 text-base font-semibold text-blue-900">
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
                            className={`absolute left-1/2 top-[15px] h-[3px] w-full rounded-full ${getConnectorClasses(
                              index
                            )}`}
                          ></div>
                        )}

                        <div
                          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-sm ${getTimelineDotClasses(
                            item.state,
                            item.key
                          )}`}
                        >
                          {item.state === "skipped" ? (
                            <span className="text-[10px] font-bold text-white">×</span>
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>

                        <div className="mt-3 text-center">
                          <p
                            className={`text-xs font-bold ${
                              item.state === "current"
                                ? "text-blue-700"
                                : item.state === "completed"
                                ? "text-blue-700"
                                : item.state === "skipped"
                                ? "text-rose-700"
                                : "text-gray-500"
                            }`}
                          >
                            {item.label}
                          </p>

                          <div className="mt-1">
                            {item.state === "current" ? (
                              <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">
                                Current
                              </span>
                            ) : item.state === "completed" ? (
                              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                                Done
                              </span>
                            ) : item.state === "skipped" ? (
                              <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-700">
                                Skipped
                              </span>
                            ) : (
                              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                                Upcoming
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-[11px] text-gray-400">
                            {item.state === "upcoming" || item.state === "skipped"
                              ? "—"
                              : item.changedAt
                              ? new Date(item.changedAt).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
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
                <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-5">
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
            </SectionCard>
          )}
          

            {isSectionVisible("summary") && (
              <SectionCard
              badge="Loan Summary"
              title="Application Overview"
              subtitle="A quick summary of the core details for this loan application."
              icon="📘"
              >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DetailItem
                  label="Current Status"
                  value={getCustomerStatusLabel(loan.status)}
                  tone="default"
                />
                <DetailItem
                  label="Loan Amount"
                  value={formatCurrency(loan.loanDetails?.amount)}
                  tone="emerald"
                />
                <DetailItem
                  label="Tenure"
                  value={`${loan.loanDetails?.tenure || "N/A"} months`}
                  tone="blue"
                />
                <DetailItem
                  label="Interest Rate"
                  value={`${loan.loanDetails?.interestRate || "N/A"}%`}
                  tone="amber"
                />
              </div>

              <div className="mt-4 rounded-[24px] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                  Status Note
                </p>
                <p className="mt-2 text-sm leading-7 text-gray-600">
                  {getCustomerStatusMessage(loan.status)}
                </p>
              </div>
            </SectionCard>
          )}

           {(isSectionVisible("employment") || isSectionVisible("kyc")) && (
  <div
    className={`grid gap-6 ${
      activeSection === "all" ? "xl:grid-cols-[1fr_1fr]" : ""
    }`}
  >
    {isSectionVisible("employment") && (
      <SectionCard
        badge="Work Profile"
        title="Employment Details"
        subtitle="Employment and income information submitted in your application."
        icon="💼"
      >
        <div className="grid grid-cols-1 gap-4">
          <DetailItem
            label="Company Name"
            value={loan.employmentDetails?.companyName || "N/A"}
            tone="blue"
          />
          <DetailItem
            label="Location"
            value={loan.employmentDetails?.location || "N/A"}
            tone="amber"
          />
          <DetailItem
            label="Salary"
            value={formatCurrency(loan.employmentDetails?.salary)}
            tone="emerald"
          />
          <DetailItem
            label="Net Hand Salary"
            value={formatCurrency(loan.employmentDetails?.netHandSalary)}
            tone="violet"
          />
        </div>
      </SectionCard>
    )}

    {isSectionVisible("kyc") && (
      <SectionCard
        badge="Identity Check"
        title="KYC Details"
        subtitle="Identity and address details used for verification."
        icon="🪪"
      >
        <div className="grid grid-cols-1 gap-4">
          <DetailItem
            label="PAN Number"
            value={loan.kycDetails?.panNumber || "N/A"}
            tone="violet"
          />
          <DetailItem
            label="Aadhaar Number"
            value={loan.kycDetails?.aadharNumber || "N/A"}
            tone="blue"
          />
          <DetailItem
            label="Address"
            value={loan.kycDetails?.address || "N/A"}
            tone="default"
          />
        </div>
      </SectionCard>
    )}
  </div>
)}
            {isSectionVisible("documents") && (
            <SectionCard
              badge="Document Vault"
              title="Uploaded Documents"
              subtitle="Review all submitted files attached to your application."
              icon="📁"
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <DocumentCard
                  title="PAN Card"
                  links={panFileUrl ? [panFileUrl] : []}
                  emptyText="PAN card not uploaded"
                />

                <DocumentCard
                  title="Aadhaar Card"
                  links={aadhaarFileUrl ? [aadhaarFileUrl] : []}
                  emptyText="Aadhaar card not uploaded"
                />

                <DocumentCard
                  title="Bank Statements"
                  links={bankStatementLinks}
                  emptyText="Bank statements not uploaded"
                />

                <DocumentCard
                  title="IT Returns"
                  links={itReturnLinks}
                  emptyText="IT returns not uploaded"
                />

                <DocumentCard
                  title="Payslips"
                  links={payslipLinks}
                  emptyText="Payslips not uploaded"
                />
              </div>
            </SectionCard>
          )}

            {loan.remarks && isSectionVisible("remarks") && (
              <SectionCard
                badge="Remarks"
                title="Application Remarks"
                subtitle="Additional notes related to your application."
                icon="📝"
              >
                <div className="rounded-2xl border border-gray-200 bg-white p-5 text-gray-700 shadow-sm">
                  {loan.remarks}
                </div>
              </SectionCard>
            )}
          </div>
        
        )}
      </div>
    </div>
  );
};

export default MyLoanDetails;