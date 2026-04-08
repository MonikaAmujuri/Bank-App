import React, { useState } from "react";
import {
  BadgeInfo,
  IndianRupee,
  Hourglass,
  Wrench,
  BadgeCheck,
  Landmark,
  BriefcaseBusiness,
  GraduationCap,
  FolderOpen,
  IdCard,
  FileText,
} from "lucide-react";

const ReviewSubmit = ({ loanData, status, onUpdateStatus, statusUpdating }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showMobileTimeline, setShowMobileTimeline] = useState(false);
  const [showMobileHeroDetails, setShowMobileHeroDetails] = useState(false);

  const headingText =
    status === "approved"
      ? "Approved Loan Summary"
      : status === "rejected"
      ? "Rejected Loan Summary"
      : status === "disbursed"
      ? "Completed Loan Summary"
      : "Review & Submit";

  const subText =
    status === "approved"
      ? "This loan has been approved. Review the final submitted details below."
      : status === "rejected"
      ? "This loan has been rejected. Review the submitted details below."
      : status === "disbursed"
      ? "This loan has been completed. Review the details below"
      : "Please review all loan details carefully before submitting.";

  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === "") return "₹0";
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const formatText = (value, fallback = "N/A") => {
    if (value === undefined || value === null || value === "") return fallback;
    return value;
  };

  const formatLoanType = (value) => {
    if (!value) return "N/A";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const formatPercent = (value) => {
    if (value === undefined || value === null || value === "") return "0%";
    return `${value}%`;
  };

  const formatMonths = (value) => {
    if (value === undefined || value === null || value === "") return "0 months";
    return `${value} months`;
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString();
  };

  const formatDateTime = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleString();
  };

  const isEducationLoan =
  loanData?.loanDetails?.loanType === "Education Loan";

  const getStatusClasses = (statusValue) => {
    switch (statusValue) {
      case "draft":
        return "border border-gray-200 bg-gray-100 text-gray-700";
      case "submitted":
        return "border border-blue-200 bg-blue-100 text-blue-700";
      case "under_review":
        return "border border-yellow-200 bg-yellow-100 text-yellow-700";
      case "documents_pending":
        return "border border-orange-200 bg-orange-100 text-orange-700";
      case "approved":
        return "border border-green-200 bg-green-100 text-green-700";
      case "rejected":
        return "border border-red-200 bg-red-100 text-red-700";
      case "disbursed":
        return "border border-emerald-200 bg-emerald-100 text-emerald-700";
      case "pending":
        return "border border-blue-200 bg-blue-100 text-blue-700";
      default:
        return "border border-gray-200 bg-gray-100 text-gray-700";
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
      changedBy: historyItem?.changedBy || null,
    };
  });

  const isActiveTimelineState = (state) =>
    state === "completed" || state === "current";

  const getConnectorClasses = (index) => {
    const leftStage = fullTimeline[index];
    const rightStage = fullTimeline[index + 1];

    return leftStage &&
      rightStage &&
      isActiveTimelineState(leftStage.state) &&
      isActiveTimelineState(rightStage.state)
      ? "bg-green-400"
      : "bg-gray-200";
  };

  const getHorizontalDotClasses = (state, key) => {
    if (state === "completed") return "bg-green-500";
    if (state === "skipped") return "bg-rose-300";
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

  const getVerticalLineColor = (state) => {
    if (state === "completed") return "bg-green-500";
    if (state === "current") return "bg-indigo-500";
    if (state === "skipped") return "bg-rose-300";
    return "bg-gray-200";
  };

  const visibleHistory = showAllHistory
    ? timelineHistory.slice().reverse()
    : timelineHistory.slice().reverse().slice(0, 2);

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
        className={`rounded-2xl sm:rounded-3xl border p-4 shadow-sm transition hover:shadow-md ${toneClasses[tone]}`}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
          {label}
        </p>
        <p className="mt-3 break-words text-base sm:text-lg font-bold text-gray-900">
          {value || "N/A"}
        </p>
      </div>
    );
  };

  const SectionCard = ({
    title,
    subtitle,
    children,
    right,
    badge = "SECTION",
  }) => (
    <section className="overflow-hidden rounded-2xl sm:rounded-[30px] border border-gray-100 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.07)]">
      <div className="border-b border-indigo-50 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="mb-2 inline-flex rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 shadow-sm">
              {badge}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-[30px] font-bold text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 md:text-base">
                {subtitle}
              </p>
            )}
          </div>
          {right}
        </div>
      </div>

      <div className="bg-gradient-to-b from-white to-slate-50/70 p-4 sm:p-6">
        {children}
      </div>
    </section>
  );

  const DocumentCard = ({ title, files, singleFile, emptyText }) => {
    const hasSingle = !!singleFile;
    const hasMultiple = Array.isArray(files) && files.length > 0;
    const count = hasMultiple ? files.length : hasSingle ? 1 : 0;

    return (
      <div className="group rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-4 sm:p-5 transition duration-300 hover:border-indigo-200 hover:shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {count > 0
                  ? `${count} file${count > 1 ? "s" : ""} available`
                  : emptyText}
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${
              count > 0
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {count > 0 ? "Uploaded" : "Missing"}
          </span>
        </div>

        {hasSingle ? (
          <a
            href={singleFile}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            View Document
          </a>
        ) : hasMultiple ? (
          <div className="space-y-2">
            {files.map((file, index) => (
              <a
                key={index}
                href={file}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-50 gap-3"
              >
                <span className="truncate">
                  {title} {index + 1}
                </span>
                <span className="shrink-0">Open ↗</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium text-red-500">{emptyText}</p>
        )}
      </div>
    );
  };

  const handleStatusUpdateClick = () => {
    onUpdateStatus(selectedStatus, statusNote);
    setSelectedStatus("");
    setStatusNote("");
  };

  return (
    <div className="mx-auto w-full max-w-full overflow-x-hidden space-y-5 sm:space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-2xl sm:rounded-[30px] bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 px-4 py-5 sm:px-6 sm:py-7 md:px-7 md:py-8 text-white shadow-[0_18px_50px_rgba(59,130,246,0.24)]">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%)]"></div>
  <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>
  <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl"></div>

  <div className="relative flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
    <div className="min-w-0 max-w-4xl">
      <p className="mb-3 inline-flex max-w-full rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur sm:px-4 sm:text-[11px] sm:tracking-[0.24em]">
        Agent Review Workspace
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <h1 className="break-words text-2xl sm:text-3xl md:text-[52px] font-bold leading-tight">
          {headingText}
        </h1>
        <span
          className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${getStatusClasses(
            loanData?.status
          )}`}
        >
          {getStatusLabel(loanData?.status)}
        </span>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 sm:leading-7 text-blue-50 md:text-[15px]">
        {subText}
      </p>
    </div>

    <div className="w-full xl:w-auto">
      <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur xl:min-w-[220px]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
          Current Status
        </p>
        <div className="mt-3">
          <span
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusClasses(
              loanData?.status
            )}`}
          >
            {getStatusLabel(loanData?.status)}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div className="mt-5 sm:hidden">
    <button
      type="button"
      onClick={() => setShowMobileHeroDetails((prev) => !prev)}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
    >
      <span>{showMobileHeroDetails ? "Hide Details" : "Show Details"}</span>
      <span
        className={`transition-transform duration-200 ${
          showMobileHeroDetails ? "rotate-180" : ""
        }`}
      >
        ▼
      </span>
    </button>
  </div>

  {showMobileHeroDetails && (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:hidden">
      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
        <p className="text-xs text-blue-100">Loan Type</p>
        <p className="mt-1 text-sm font-semibold text-white break-words">
          {formatLoanType(loanData.loanDetails?.loanType)}
        </p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
        <p className="text-xs text-blue-100">Amount</p>
        <p className="mt-1 text-sm font-semibold text-white break-words">
          {formatCurrency(loanData.loanDetails?.amount)}
        </p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
        <p className="text-xs text-blue-100">Current Status</p>
        <p className="mt-1 text-sm font-semibold text-white break-words">
          {getStatusLabel(loanData?.status)}
        </p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
        <p className="text-xs text-blue-100">Created</p>
        <p className="mt-1 text-sm font-semibold text-white break-words">
          {formatDate(loanData.createdAt)}
        </p>
      </div>
    </div>
  )}

  <div className="mt-5 hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2 xl:flex xl:flex-wrap">
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-xs text-blue-100">Loan Type</p>
      <p className="mt-1 text-sm font-semibold text-white break-words">
        {formatLoanType(loanData.loanDetails?.loanType)}
      </p>
    </div>

    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-xs text-blue-100">Amount</p>
      <p className="mt-1 text-sm font-semibold text-white break-words">
        {formatCurrency(loanData.loanDetails?.amount)}
      </p>
    </div>

    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-xs text-blue-100">Current Status</p>
      <p className="mt-1 text-sm font-semibold text-white break-words">
        {getStatusLabel(loanData?.status)}
      </p>
    </div>

    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-xs text-blue-100">Created</p>
      <p className="mt-1 text-sm font-semibold text-white break-words">
        {formatDate(loanData.createdAt)}
      </p>
    </div>
  </div>
</section>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-2xl sm:rounded-[28px] border border-indigo-100 bg-white p-4 sm:p-6 shadow-[0_10px_35px_rgba(99,102,241,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Current Status</p>
              <div className="mt-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    loanData?.status
                  )}`}
                >
                  {getStatusLabel(loanData?.status)}
                </span>
              </div>
            </div>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
              <BadgeInfo className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl sm:rounded-[28px] border border-gray-100 bg-white p-4 sm:p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Loan Amount</p>
              <h3 className="mt-3 break-words text-lg sm:text-2xl font-bold text-gray-900">
                {formatCurrency(loanData.loanDetails?.amount)}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {formatLoanType(loanData.loanDetails?.loanType)}
              </p>
            </div>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
              <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl sm:rounded-[28px] border border-gray-100 bg-white p-4 sm:p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Tenure</p>
              <h3 className="mt-3 break-words text-lg sm:text-2xl font-bold text-indigo-600">
                {formatMonths(loanData.loanDetails?.tenure)}
              </h3>
              <p className="mt-1 text-sm text-gray-500">Loan Duration</p>
            </div>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shrink-0">
              <Hourglass className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl sm:rounded-[28px] border border-gray-100 bg-white p-4 sm:p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <h3 className="mt-3 break-words text-sm sm:text-lg font-bold text-gray-900">
                {formatDate(loanData.updatedAt)}
              </h3>
              <p className="mt-1 text-sm text-gray-500">Review Timestamp</p>
            </div>
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 shrink-0">
              <Wrench className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl sm:rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
        <div className="border-b border-gray-100 bg-gradient-to-r from-white to-slate-50 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Loan Timeline
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Stage tracker and audit-friendly history for this loan.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                loanData?.status
              )}`}
            >
              {getStatusLabel(loanData?.status)}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setShowMobileTimeline((prev) => !prev)}
              className="mb-4 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {showMobileTimeline ? "Hide Timeline" : "View Timeline"}
            </button>

            {showMobileTimeline && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="space-y-4">
                  {fullTimeline.map((item, index) => (
                    <div key={item.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-sm ${getHorizontalDotClasses(
                            item.state,
                            item.key
                          )}`}
                        >
                          {item.state === "skipped" ? (
                            <span className="text-[10px] font-bold text-white">
                              ×
                            </span>
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>

                        {index !== fullTimeline.length - 1 && (
                          <div
                            className={`mt-1 w-1 min-h-[42px] flex-1 rounded-full ${getVerticalLineColor(
                              fullTimeline[index + 1]?.state
                            )}`}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 rounded-2xl border border-gray-100 bg-white p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={`text-sm font-bold ${
                              item.state === "current"
                                ? "text-indigo-700"
                                : item.state === "completed"
                                ? "text-emerald-700"
                                : item.state === "skipped"
                                ? "text-rose-700"
                                : "text-gray-700"
                            }`}
                          >
                            {item.label}
                          </p>

                          {item.state === "current" ? (
                            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
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

                        <p className="mt-2 text-xs text-gray-400">
                          {item.state === "upcoming" || item.state === "skipped"
                            ? "N/A"
                            : item.changedAt
                            ? new Date(item.changedAt).toLocaleDateString()
                            : "N/A"}
                        </p>

                        {item.note ? (
                          <p className="mt-2 break-words text-sm text-gray-600">
                            {item.note}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <div className="rounded-[24px] border border-slate-100 bg-slate-50/70 px-4 py-6">
              <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Progress Overview
              </p>

              <div className="w-full max-w-full overflow-x-auto pb-2">
                <div className="min-w-[760px] lg:min-w-[920px] px-3 pt-2">
                  <div className="relative flex items-start justify-between">
                    {fullTimeline.map((item, index) => (
                      <div
                        key={item.key}
                        className="relative flex flex-1 flex-col items-center"
                      >
                        {index !== fullTimeline.length - 1 && (
                          <div
                            className={`absolute left-1/2 top-[15px] h-[3px] w-full rounded-full ${getConnectorClasses(
                              index
                            )}`}
                          ></div>
                        )}

                        <div
                          className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white shadow-sm ${getHorizontalDotClasses(
                            item.state,
                            item.key
                          )}`}
                        >
                          {item.state === "skipped" ? (
                            <span className="text-[10px] font-bold text-white">
                              ×
                            </span>
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                          )}
                        </div>

                        <div className="mt-3 text-center">
                          <p
                            className={`text-xs font-bold ${
                              item.state === "current"
                                ? "text-indigo-700"
                                : item.state === "completed"
                                ? "text-emerald-700"
                                : item.state === "skipped"
                                ? "text-rose-700"
                                : "text-gray-500"
                            }`}
                          >
                            {item.label}
                          </p>

                          <div className="mt-1">
                            {item.state === "current" ? (
                              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700">
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
                              ? "N/A"
                              : item.changedAt
                              ? new Date(item.changedAt).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="mt-6">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
                  Audit History
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {timelineHistory.length} update{timelineHistory.length > 1 ? "s" : ""}
                </p>
              </div>

              {timelineHistory.length > 2 && (
                <button
                  type="button"
                  onClick={() => setShowAllHistory((prev) => !prev)}
                  className="w-full sm:w-auto rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100"
                >
                  {showAllHistory
                    ? "Show less"
                    : `View all ${timelineHistory.length} updates`}
                </button>
              )}
            </div>

            <div
              className={
                showAllHistory
                  ? "grid grid-cols-1 gap-3 md:grid-cols-2"
                  : "space-y-3"
              }
            >
              {visibleHistory.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 transition hover:border-gray-200 hover:bg-white"
                >
                  <div className="flex flex-col gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                        <span
                          className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusClasses(
                            item.status
                          )}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>

                        <span className="text-xs text-gray-400">
                          {formatDateTime(item.changedAt)}
                        </span>
                      </div>

                      <p className="mt-3 break-words text-sm font-semibold text-gray-900">
                        {item.note || "No note provided"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Updated by{" "}
                        <span className="font-semibold text-gray-700">
                          {item.changedBy?.name
                            ? `${item.changedBy.name}${
                                item.changedBy.role ? ` (${item.changedBy.role})` : ""
                              }`
                            : "System / Agent"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl sm:rounded-[28px] border border-gray-100 bg-white p-4 sm:p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Status Control</h2>
            <p className="mt-1 text-sm text-gray-500">
              Move the loan forward and save an internal note for audit history.
            </p>
          </div>
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm">
            <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
            Current Status
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                loanData.status
              )}`}
            >
              {getStatusLabel(loanData.status)}
            </span>

            <span className="hidden rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold text-amber-700 sm:inline-flex">
              Stage Control
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Select Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            >
              <option value="">Select Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="documents_pending">Documents Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="disbursed">Disbursed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Note <span className="text-red-500">*</span>
            </label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="Enter reason / note for this status update"
              rows={4}
              className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="hidden text-xs text-gray-500 md:block">
            This update will appear in audit history below.
          </p>

          <button
            onClick={handleStatusUpdateClick}
            disabled={statusUpdating || !selectedStatus || !statusNote.trim()}
            className="w-full sm:w-auto rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {statusUpdating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </section>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
          <div className="min-w-0 space-y-6">
            <SectionCard
              title="Loan Overview"
              subtitle="Primary financial details and lending configuration."
              badge="Financial Summary"
              right={
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl sm:rounded-3xl border border-indigo-100 bg-white/80 text-indigo-600 shadow-sm">
                  <Landmark className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
                </div>
              }
            >
              <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-2xl sm:rounded-[26px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 sm:p-5 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                    Loan Amount
                  </p>

                  <h3 className="mt-3 break-words text-2xl sm:text-3xl md:text-[38px] font-extrabold text-gray-900">
                    {formatCurrency(loanData.loanDetails?.amount)}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-gray-600">
                    Total requested loan value configured for this application.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                      {formatLoanType(loanData.loanDetails?.loanType)}
                    </span>
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                      {formatMonths(loanData.loanDetails?.tenure)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 2xl:grid-cols-1">
                  <DetailItem
                    label="Interest Rate"
                    value={formatPercent(
                      loanData.loanDetails?.interestRate || loanData.loanDetails?.intrestRate
                    )}
                    tone="blue"
                  />
                  <DetailItem
                    label="Tenure"
                    value={formatMonths(loanData.loanDetails?.tenure)}
                    tone="amber"
                  />
                  <DetailItem
                    label="Loan Type"
                    value={formatLoanType(loanData.loanDetails?.loanType)}
                    tone="violet"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
  title={isEducationLoan ? "Education Details" : "Employment Details"}
  subtitle={
    isEducationLoan
      ? "Applicant education profile, course information, and fee details."
      : "Applicant work profile, salary details, and location."
  }
  badge={isEducationLoan ? "Education Profile" : "Work Profile"}
  right={
    <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl sm:rounded-3xl border border-blue-100 bg-white/80 text-blue-600 shadow-sm">
      {isEducationLoan ? (
        <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
      ) : (
        <BriefcaseBusiness className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
      )}
    </div>
  }
>
  {isEducationLoan ? (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-2xl sm:rounded-[26px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4 sm:p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
          Education Snapshot
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-white/80 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Course Fee
            </p>
            <p className="mt-3 break-words text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900">
              {formatCurrency(loanData.educationDetails?.courseFee)}
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-sky-100 bg-white/80 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Current Year of Study
            </p>
            <p className="mt-3 break-words text-xl sm:text-2xl font-bold leading-tight text-gray-900">
              {formatText(loanData.educationDetails?.studyYear)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Primary education details used for student loan evaluation and verification.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailItem
          label="Institution"
          value={formatText(loanData.educationDetails?.institutionName)}
          tone="blue"
        />
        <DetailItem
          label="Course"
          value={formatText(loanData.educationDetails?.courseName)}
          tone="amber"
        />
        <DetailItem
          label="Course Duration"
          value={formatText(loanData.educationDetails?.courseDuration)}
          tone="violet"
        />
        <DetailItem
          label="Institute Location"
          value={formatText(loanData.educationDetails?.instituteLocation)}
          tone="default"
        />
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-2xl sm:rounded-[26px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4 sm:p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
          Income Snapshot
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-white/80 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Salary
            </p>
            <p className="mt-3 break-words text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900">
              {formatCurrency(loanData.employmentDetails?.salary)}
            </p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-sky-100 bg-white/80 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Net Salary
            </p>
            <p className="mt-3 break-words text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900">
              {formatCurrency(loanData.employmentDetails?.netHandSalary)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Primary employment income used for loan evaluation and repayment review.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailItem
          label="Company"
          value={formatText(loanData.employmentDetails?.companyName)}
          tone="blue"
        />
        <DetailItem
          label="Location"
          value={formatText(loanData.employmentDetails?.location)}
          tone="amber"
        />
        <DetailItem
          label="Job Title"
          value={formatText(loanData.employmentDetails?.jobTitle)}
          tone="violet"
        />
      </div>
    </div>
  )}
</SectionCard>
          </div>

          <div className="min-w-0 space-y-6">
            {loanData?.kycDetails && (
              <SectionCard
                title="Uploaded Documents"
                subtitle="Review all submitted files for KYC and income proof."
                badge="Document Vault"
                right={
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
                  </div>
                }
              >
                <div id="documents" className="grid grid-cols-1 gap-4">
                  <DocumentCard
                    title="PAN Card"
                    singleFile={loanData.kycDetails?.panFile}
                    emptyText="PAN card not uploaded"
                  />

                  <DocumentCard
                    title="Aadhaar Card"
                    singleFile={loanData.kycDetails?.aadhaarFile}
                    emptyText="Aadhaar card not uploaded"
                  />

                  <DocumentCard
                    title="Bank Statement"
                    files={loanData.kycDetails?.bankStatements}
                    emptyText="Bank statements not uploaded"
                  />

                  {isEducationLoan ? (
                    <>
                      <DocumentCard
                        title="Admission Letter"
                        singleFile={loanData.kycDetails?.admissionLetter}
                        emptyText="Admission letter not uploaded"
                      />

                      <DocumentCard
                        title="Fee Structure / Fee Receipt"
                        singleFile={loanData.kycDetails?.feeStructure}
                        emptyText="Fee structure not uploaded"
                      />

                      <DocumentCard
                        title="Academic Marksheets"
                        files={loanData.kycDetails?.marksheets}
                        emptyText="Academic marksheets not uploaded"
                      />
                    </>
                  ) : (
                    <>
                      <DocumentCard
                        title="IT Return"
                        files={loanData.kycDetails?.itReturns}
                        emptyText="IT returns not uploaded"
                      />

                      <DocumentCard
                        title="Payslip"
                        files={loanData.kycDetails?.payslips}
                        emptyText="Payslips not uploaded"
                      />
                    </>
                  )}
                </div>
              </SectionCard>
            )}
          </div>
        </div>

        <SectionCard
          title="KYC Details"
          subtitle="Identity details and address used for verification."
          badge="Identity Check"
          right={
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl sm:rounded-3xl border border-violet-100 bg-white/80 text-violet-600 shadow-sm">
              <IdCard className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-2xl sm:rounded-[26px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4 sm:p-5 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">
                Identity Snapshot
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-violet-100 bg-white/85 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                    PAN Number
                  </p>
                  <p className="mt-2 break-all font-mono text-base sm:text-lg font-semibold tracking-[0.08em] text-gray-900">
                    {formatText(loanData.kycDetails?.panNumber)}
                  </p>
                </div>

                <div className="rounded-2xl border border-fuchsia-100 bg-white/85 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                    Aadhaar Number
                  </p>
                  <p className="mt-2 break-all font-mono text-base sm:text-lg font-semibold tracking-[0.08em] text-gray-900">
                    {formatText(
                      loanData.kycDetails?.aadharNumber ||
                        loanData.kycDetails?.aadhaarNumber
                    )}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                Primary identity information used for KYC verification and compliance review.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <DetailItem
                label="Verification Status"
                value={
                  loanData.kycDetails?.panNumber &&
                  (loanData.kycDetails?.aadharNumber ||
                    loanData.kycDetails?.aadhaarNumber)
                    ? "Identity details available"
                    : "Incomplete KYC details"
                }
                tone="violet"
              />
              <DetailItem
                label="Address Type"
                value={loanData.kycDetails?.address ? "Address provided" : "Address missing"}
                tone="amber"
              />
              <DetailItem
                label="Address"
                value={formatText(loanData.kycDetails?.address)}
                tone="default"
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default ReviewSubmit;