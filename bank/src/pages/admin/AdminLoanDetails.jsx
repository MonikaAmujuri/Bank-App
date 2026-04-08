import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BadgeInfo,
  IndianRupee,
  UserRound,
  Wrench,
  UserCog,
  BadgeCheck,
  Landmark,
  BriefcaseBusiness,
  GraduationCap,
  IdCard,
  FolderOpen,
  ChartColumn,
  FileText,
} from "lucide-react";

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
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showMobileTimeline, setShowMobileTimeline] = useState(false);
  const [showMobileHeroDetails, setShowMobileHeroDetails] = useState(false);

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
  isEducationLoan
    ? { section: "educationDetails", data: editedLoan.educationDetails }
    : { section: "employmentDetails", data: editedLoan.employmentDetails },
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
        return status || "N/A";
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

  const getVerticalLineColor = (state) => {
  if (state === "completed") return "bg-green-500";
  if (state === "current") return "bg-indigo-500";
  if (state === "skipped") return "bg-rose-300";
  return "bg-gray-200";
};

  const formatText = (value, fallback = "N/A") => {
    if (value === undefined || value === null || value === "") return fallback;
    return value;
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === "") return "₹0";
    return `₹${Number(value).toLocaleString("en-IN")}`;
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

  const InfoItem = ({ label, value, tone = "default" }) => {
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
            <h2 className="text-xl sm:text-2xl lg:text-[30px] font-bold text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 md:text-base">{subtitle}</p>
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
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 sm:h-12 sm:w-12">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {count > 0 ? `${count} file${count > 1 ? "s" : ""} available` : emptyText}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
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
                className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-50"
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

  if (!loan || !editedLoan) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:rounded-[28px] sm:p-10">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const visibleHistory = showAllHistory
    ? timelineHistory.slice().reverse()
    : timelineHistory.slice().reverse().slice(0, 2);

  const isEducationLoan = loan?.loanDetails?.loanType === "Education Loan";

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-5 bg-gradient-to-b from-slate-50 via-white to-white sm:space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-2xl sm:rounded-[30px] bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 px-4 py-5 sm:px-6 sm:py-7 md:px-7 md:py-8 text-white shadow-[0_18px_50px_rgba(59,130,246,0.24)]">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%)]"></div>
  <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>
  <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl"></div>

  <div className="relative flex flex-col gap-5">
    <div className="min-w-0 max-w-4xl">
      <p className="mb-3 inline-flex max-w-full rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur sm:px-4 sm:text-[11px] sm:tracking-[0.24em]">
        Admin Loan Control Panel
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <h1 className="break-all text-3xl sm:text-4xl md:text-[52px] font-bold leading-tight">
          {loan.loanId}
        </h1>

        <span
          className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${getStatusClasses(
            loan.status
          )}`}
        >
          {getStatusLabel(loan.status)}
        </span>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 sm:leading-7 text-blue-50 md:text-[15px]">
        Review loan information, manage processing status, assign handling
        agents, inspect uploaded documents, and maintain a complete audit
        trail from a single admin workspace.
      </p>
    </div>

    {/* Mobile toggle */}
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setShowMobileHeroDetails((prev) => !prev)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
      >
        <span>
          {showMobileHeroDetails ? "Hide loan details" : "Show loan details"}
        </span>
        <span className={`transition-transform duration-200 ${showMobileHeroDetails ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
    </div>

    {/* Mobile expanded hero details */}
    {showMobileHeroDetails && (
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <p className="text-xs text-blue-100">Loan Type</p>
          <p className="mt-1 text-sm font-semibold text-white break-words">
            {formatText(loan.loanDetails?.loanType)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <p className="text-xs text-blue-100">Amount</p>
          <p className="mt-1 text-sm font-semibold text-white break-words">
            {formatCurrency(loan.loanDetails?.amount)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <p className="text-xs text-blue-100">Assigned Agent</p>
          <p className="mt-1 text-sm font-semibold text-white break-words">
            {formatText(loan.agentId?.name, "Not assigned")}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <p className="text-xs text-blue-100">Created</p>
          <p className="mt-1 text-sm font-semibold text-white break-words">
            {formatDate(loan.createdAt)}
          </p>
        </div>

        {!editing ? (
          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={() => setEditing(true)}
              className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
            >
              Edit Loan
            </button>

            <a
              href="#documents"
              className="w-full rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-center font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              View Documents
            </a>

            <a
              href="#timeline"
              className="w-full rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-center font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Timeline
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-1">
            <button
              onClick={handleSave}
              className="w-full rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-600"
            >
              Save Changes
            </button>

            <button
              onClick={handleCancel}
              className="w-full rounded-2xl border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    )}

    {/* Desktop / tablet full hero details */}
    <div className="hidden sm:block">
      <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <p className="text-xs text-blue-100">Loan Type</p>
          <p className="mt-1 text-sm font-semibold text-white break-words">
            {formatText(loan.loanDetails?.loanType)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <p className="text-xs text-blue-100">Amount</p>
          <p className="mt-1 text-sm font-semibold text-white break-words">
            {formatCurrency(loan.loanDetails?.amount)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <p className="text-xs text-blue-100">Assigned Agent</p>
          <p className="mt-1 text-sm font-semibold text-white break-words">
            {formatText(loan.agentId?.name, "Not assigned")}
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <p className="text-xs text-blue-100">Created</p>
          <p className="mt-1 text-sm font-semibold text-white break-words">
            {formatDate(loan.createdAt)}
          </p>
        </div>
      </div>

      {!editing ? (
        <div className="mt-5 flex w-full flex-col gap-3 xl:w-auto xl:min-w-[220px] xl:flex-row xl:flex-wrap">
          <button
            onClick={() => setEditing(true)}
            className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 xl:w-auto"
          >
            Edit Loan
          </button>
          <a
            href="#documents"
            className="w-full rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-center font-semibold text-white backdrop-blur transition hover:bg-white/20 xl:w-auto"
          >
            View Documents
          </a>
          <a
            href="#timeline"
            className="w-full rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-center font-semibold text-white backdrop-blur transition hover:bg-white/20 xl:w-auto"
          >
            Timeline
          </a>
        </div>
      ) : (
        <div className="mt-5 flex w-full flex-col gap-3 xl:w-auto xl:min-w-[220px] xl:flex-row xl:flex-wrap">
          <button
            onClick={handleSave}
            className="w-full rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-emerald-600 xl:w-auto"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="w-full rounded-2xl border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20 xl:w-auto"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  </div>
</section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-[0_10px_35px_rgba(99,102,241,0.08)] sm:rounded-[28px] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Current Status</p>
              <div className="mt-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    loan.status
                  )}`}
                >
                  {getStatusLabel(loan.status)}
                </span>
              </div>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 sm:h-12 sm:w-12">
              <BadgeInfo className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Loan Amount</p>
              <h3 className="mt-3 break-words text-xl font-bold text-gray-900 sm:text-2xl">
                {formatCurrency(loan.loanDetails?.amount)}
              </h3>
              <p className="mt-1 break-words text-sm text-gray-500">
                {formatText(loan.loanDetails?.loanType)}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12">
              <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Assigned Agent</p>
              <h3 className="mt-3 break-words text-xl font-bold text-indigo-600 sm:text-2xl">
                {loan.agentId?.name || "Unassigned"}
              </h3>
              <p className="mt-1 break-words text-sm text-gray-500">
                {loan.agentId?.agentId || "No agent assigned"}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
              <UserRound className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-500">Last Modified</p>
              <h3 className="mt-3 break-words text-base font-bold text-gray-900 sm:text-lg">
                {loan.lastModifiedBy
                  ? `${loan.lastModifiedBy.name} (${loan.lastModifiedBy.role})`
                  : "N/A"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{formatDate(loan.updatedAt)}</p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 sm:h-12 sm:w-12">
              <Wrench className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:gap-6 2xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Assign Agent</h2>
              <p className="mt-1 text-sm text-gray-500">
                Reassign ownership and keep loan handling organized.
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm sm:h-12 sm:w-12">
              <UserCog className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">
              Current Assigned Agent
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                  {loan.agentId?.name || "Unassigned"}
                </p>
                <p className="mt-1 break-words text-sm text-gray-500">
                  {loan.agentId?.agentId || "No agent assigned yet"}
                </p>
              </div>

              <span className="w-fit rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                Ownership
              </span>
            </div>
          </div>

          {assignError && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {assignError}
            </div>
          )}

          {assignMessage && (
            <div className="mb-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              {assignMessage}
            </div>
          )}

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
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
              className="h-14 w-full rounded-2xl bg-indigo-600 px-6 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:opacity-60 md:w-auto md:min-w-[160px]"
            >
              {assigning
                ? "Saving..."
                : loan.agentId
                ? "Change Agent"
                : "Assign Agent"}
            </button>
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500">
              Assign a new owner for review, follow-up, and status movement.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
                Current owner: {loan.agentId?.name || "Unassigned"}
              </span>

              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                Ownership active
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Status Control</h2>
              <p className="mt-1 text-sm text-gray-500">
                Move the loan forward and save an internal note for audit history.
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm sm:h-12 sm:w-12">
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
                  loan.status
                )}`}
              >
                {getStatusLabel(loan.status)}
              </span>

              <span className="w-fit rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-semibold text-amber-700">
                Stage Control
              </span>
            </div>
          </div>

          {statusError && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {statusError}
            </div>
          )}

          {statusMessage && (
            <div className="mb-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              {statusMessage}
            </div>
          )}

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
            <p className="text-xs text-gray-500">
              This update will appear in audit history below.
            </p>

            <button
              onClick={handleUpdateStatus}
              disabled={statusUpdating}
              className="w-full rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:opacity-60 sm:w-auto"
            >
              {statusUpdating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </section>

      {!editing && (
        <>
          <section
            id="timeline"
            className="w-full max-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px]"
          >
            <div className="border-b border-indigo-50 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Loan Timeline
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Stage tracker and audit-friendly history for this loan.
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    loan?.status
                  )}`}
                >
                  {getStatusLabel(loan?.status)}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {/* Mobile Timeline Toggle */}
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
                                <span className="text-[10px] font-bold text-white">×</span>
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-white"></div>
                              )}
                            </div>

                            {index !== fullTimeline.length - 1 && (
                              <div
                                className={`mt-1 w-1 flex-1 min-h-[42px] rounded-full ${getVerticalLineColor(
                                  fullTimeline[index + 1]?.state
                                )}`}
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1 rounded-2xl border border-gray-100 bg-white p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <p
                                className={`text-sm font-bold ${item.state === "current"
                                    ? "text-indigo-700"
                                    : item.state === "completed"
                                      ? "text-emerald-700"
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
                                ? "—"
                                : item.changedAt
                                  ? new Date(item.changedAt).toLocaleDateString()
                                  : "-"}
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

              {/* Desktop Timeline */}
              <div className="hidden md:block">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-5 sm:rounded-[24px] sm:px-4 sm:py-6">
                  <p className="mb-4 px-1 text-xs font-bold uppercase tracking-[0.18em] text-gray-500 sm:px-3">
                    Progress Overview
                  </p>

                  <div className="w-full max-w-full overflow-x-auto pb-2">
                    <div className="min-w-[760px] px-1 pt-2 sm:min-w-[920px] sm:px-3">
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
                                <span className="text-[10px] font-bold text-white">×</span>
                              ) : (
                                <div className="h-2 w-2 rounded-full bg-white"></div>
                              )}
                            </div>

                            <div className="mt-3 text-center">
                              <p
                                className={`text-xs font-bold ${item.state === "current"
                                    ? "text-indigo-700"
                                    : item.state === "completed"
                                      ? "text-emerald-700"
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
                                  ? "—"
                                  : item.changedAt
                                    ? new Date(item.changedAt).toLocaleDateString()
                                    : "-"}
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
                      className="w-full rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100 sm:w-auto"
                    >
                      {showAllHistory ? "Show less" : `View all ${timelineHistory.length} updates`}
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
                                ? `${item.changedBy.name}${item.changedBy.role ? ` (${item.changedBy.role})` : ""
                                }`
                                : "System / Admin"}
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

          <div className="grid min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
            <div className="min-w-0 space-y-6">
              {loan.loanDetails && (
                <SectionCard
                  title="Loan Overview"
                  subtitle="Primary financial details and lending configuration."
                  badge="Financial Summary"
                  right={
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-white/80 text-indigo-600 shadow-sm sm:h-14 sm:w-14 sm:rounded-3xl">
                      <Landmark className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 shadow-sm sm:rounded-[26px] sm:p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Loan Amount
                      </p>

                      <h3 className="mt-3 break-words text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-[38px]">
                        {formatCurrency(loan.loanDetails?.amount)}
                      </h3>

                      <p className="mt-2 max-w-sm text-sm text-gray-600">
                        Total requested loan value configured for this application.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                          {formatText(loan.loanDetails?.loanType)}
                        </span>
                        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                          {formatMonths(loan.loanDetails?.tenure)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 2xl:grid-cols-1">
                      <InfoItem
                        label="Interest Rate"
                        value={formatPercent(loan.loanDetails?.interestRate)}
                        tone="blue"
                      />

                      <InfoItem
                        label="Tenure"
                        value={formatMonths(loan.loanDetails?.tenure)}
                        tone="amber"
                      />

                      <InfoItem
                        label="Loan Type"
                        value={formatText(loan.loanDetails?.loanType)}
                        tone="violet"
                      />
                    </div>
                  </div>
                </SectionCard>
              )}

              {isEducationLoan ? (
  <SectionCard
    title="Education Details"
    subtitle="Applicant education profile, course information, and fee details."
    badge="Education Profile"
    right={
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-white/80 text-blue-600 shadow-sm sm:h-14 sm:w-14 sm:rounded-3xl">
        <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
      </div>
    }
  >
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4 shadow-sm sm:rounded-[26px] sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
          Education Snapshot
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 sm:rounded-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Course Fee
            </p>
            <p className="mt-3 break-words text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
              {formatCurrency(loan.educationDetails?.courseFee)}
            </p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white/80 p-4 sm:rounded-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Current Year of Study
            </p>
            <p className="mt-3 break-words text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
              {formatText(loan.educationDetails?.studyYear)}
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Primary education details used for student loan evaluation and document review.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoItem
          label="Institution"
          value={formatText(loan.educationDetails?.institutionName)}
          tone="blue"
        />

        <InfoItem
          label="Course"
          value={formatText(loan.educationDetails?.courseName)}
          tone="amber"
        />

        <InfoItem
          label="Course Duration"
          value={formatText(loan.educationDetails?.courseDuration)}
          tone="violet"
        />

        <InfoItem
          label="Institute Location"
          value={formatText(loan.educationDetails?.instituteLocation)}
          tone="default"
        />
      </div>
    </div>
  </SectionCard>
) : (
  loan.employmentDetails && (
    <SectionCard
      title="Employment Details"
      subtitle="Applicant work profile, salary details, and location."
      badge="Work Profile"
      right={
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-white/80 text-blue-600 shadow-sm sm:h-14 sm:w-14 sm:rounded-3xl">
          <BriefcaseBusiness className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4 shadow-sm sm:rounded-[26px] sm:p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
            Income Snapshot
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-blue-100 bg-white/80 p-4 sm:rounded-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                Salary
              </p>
              <p className="mt-3 break-words text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
                {formatCurrency(loan.employmentDetails?.salary)}
              </p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white/80 p-4 sm:rounded-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                Net Salary
              </p>
              <p className="mt-3 break-words text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
                {formatCurrency(
                  loan.employmentDetails?.netHandSalary || loan.employmentDetails?.netsalary
                )}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Primary employment income used for loan evaluation and repayment review.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="Company"
            value={formatText(loan.employmentDetails?.companyName)}
            tone="blue"
          />

          <InfoItem
            label="Location"
            value={formatText(loan.employmentDetails?.location)}
            tone="amber"
          />

          <InfoItem
            label="Job Title"
            value={formatText(loan.employmentDetails?.jobTitle)}
            tone="violet"
          />
        </div>
      </div>
    </SectionCard>
  )
)}

              {loan.kycDetails && (
                <SectionCard
                  title="KYC Details"
                  subtitle="Identity details and address used for verification."
                  badge="Identity Check"
                  right={
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-100 bg-white/80 text-violet-600 shadow-sm sm:h-14 sm:w-14 sm:rounded-3xl">
                      <IdCard className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-4 shadow-sm sm:rounded-[26px] sm:p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">
                        Identity Snapshot
                      </p>

                      <div className="mt-4 space-y-3">
                        <div className="rounded-2xl border border-violet-100 bg-white/85 p-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                            PAN Number
                          </p>
                          <p className="mt-2 break-all font-mono text-base font-semibold tracking-[0.08em] text-gray-900 sm:text-lg">
                            {formatText(loan.kycDetails?.panNumber)}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-fuchsia-100 bg-white/85 p-4">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                            Aadhaar Number
                          </p>
                          <p className="mt-2 break-all font-mono text-base font-semibold tracking-[0.08em] text-gray-900 sm:text-lg">
                            {formatText(loan.kycDetails?.aadharNumber)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm text-gray-600">
                        Primary identity information used for KYC verification and compliance review.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <InfoItem
                        label="Verification Status"
                        value={
                          loan.kycDetails?.panNumber && loan.kycDetails?.aadharNumber
                            ? "Identity details available"
                            : "Incomplete KYC details"
                        }
                        tone="violet"
                      />

                      <InfoItem
                        label="Address Type"
                        value={loan.kycDetails?.address ? "Address provided" : "Address missing"}
                        tone="amber"
                      />

                      <InfoItem
                        label="Address"
                        value={formatText(loan.kycDetails?.address)}
                        tone="default"
                      />
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>

            <div className="min-w-0 space-y-6">
              {loan.kycDetails && (
                <SectionCard
                  title="Uploaded Documents"
                  subtitle="Review all submitted files for KYC and income proof."
                  badge="Document Vault"
                  right={
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 sm:h-12 sm:w-12">
                      <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
                    </div>
                  }
                >
                  <div id="documents" className="grid grid-cols-1 gap-4">
  <DocumentCard
    title="PAN Card"
    singleFile={loan.kycDetails?.panFile}
    emptyText="PAN card not uploaded"
  />

  <DocumentCard
    title="Aadhaar Card"
    singleFile={loan.kycDetails?.aadhaarFile}
    emptyText="Aadhaar card not uploaded"
  />

  <DocumentCard
    title="Bank Statement"
    files={loan.kycDetails?.bankStatements}
    emptyText="Bank statements not uploaded"
  />

  {isEducationLoan ? (
    <>
      <DocumentCard
        title="Admission Letter"
        singleFile={loan.kycDetails?.admissionLetter}
        emptyText="Admission letter not uploaded"
      />

      <DocumentCard
        title="Fee Structure / Fee Receipt"
        singleFile={loan.kycDetails?.feeStructure}
        emptyText="Fee structure not uploaded"
      />

      <DocumentCard
        title="Academic Marksheets"
        files={loan.kycDetails?.marksheets}
        emptyText="Academic marksheets not uploaded"
      />
    </>
  ) : (
    <>
      <DocumentCard
        title="IT Return"
        files={loan.kycDetails?.itReturns}
        emptyText="IT returns not uploaded"
      />

      <DocumentCard
        title="Payslip"
        files={loan.kycDetails?.payslips}
        emptyText="Payslips not uploaded"
      />
    </>
  )}
</div>
                </SectionCard>
              )}

              <SectionCard
                title="Admin Snapshot"
                subtitle="Quick review points for current handling."
                badge="Quick Summary"
                right={
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 sm:h-12 sm:w-12">
                    <ChartColumn className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
                  </div>
                }
              >
                <div className="space-y-4">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Current Stage
                    </p>
                    <p className="mt-2 text-lg font-bold text-gray-900">
                      {getStatusLabel(loan.status)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Agent Handling
                    </p>
                    <p className="mt-2 break-words text-lg font-bold text-gray-900">
                      {loan.agentId?.name || "Unassigned"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Last Updated
                    </p>
                    <p className="mt-2 break-words text-sm font-semibold text-gray-900 sm:text-base">
                      {formatDateTime(loan.updatedAt)}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </>
      )}

      {editing && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-4 shadow-sm sm:rounded-[28px] sm:px-6 sm:py-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Editing Loan Details</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Update the fields below and save when finished.
                </p>
              </div>
              <div className="w-fit rounded-2xl border border-amber-200 bg-white/80 px-4 py-2 text-sm font-semibold text-amber-700">
                Edit Mode Active
              </div>
            </div>
          </section>

          <SectionCard
            title="Loan Details"
            subtitle="Update core loan configuration."
            right={
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 sm:h-12 sm:w-12">
                <Landmark className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-600">Amount</p>
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
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
  <p className="mb-2 text-sm font-semibold text-gray-600">
    Interest Rate (%)
  </p>
  <input
    type="text"
    value={
      editedLoan?.loanDetails?.interestRate
        ? `${editedLoan.loanDetails.interestRate}%`
        : "0%"
    }
    readOnly
    className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
  />
</div>

              <div>
  <p className="mb-2 text-sm font-semibold text-gray-600">Tenure (Months)</p>
  <input
    type="text"
    value={
      editedLoan?.loanDetails?.tenure
        ? `${editedLoan.loanDetails.tenure} Months`
        : "0 Months"
    }
    readOnly
    className="w-full rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
  />
</div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-600">Loan Type</p>
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
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
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
          </SectionCard>

          <SectionCard
  title={isEducationLoan ? "Education Details" : "Employment Details"}
  subtitle={
    isEducationLoan
      ? "Update education and course information."
      : "Update professional and salary information."
  }
  right={
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
      {isEducationLoan ? (
        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
      ) : (
        <BriefcaseBusiness className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
      )}
    </div>
  }
>
  {isEducationLoan ? (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Institution Name</p>
        <input
          type="text"
          value={editedLoan?.educationDetails?.institutionName || ""}
          onChange={(e) =>
            setEditedLoan({
              ...editedLoan,
              educationDetails: {
                ...editedLoan.educationDetails,
                institutionName: e.target.value,
              },
            })
          }
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Course Name</p>
        <input
          type="text"
          value={editedLoan?.educationDetails?.courseName || ""}
          onChange={(e) =>
            setEditedLoan({
              ...editedLoan,
              educationDetails: {
                ...editedLoan.educationDetails,
                courseName: e.target.value,
              },
            })
          }
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Course Duration</p>
        <input
          type="text"
          value={editedLoan?.educationDetails?.courseDuration || ""}
          onChange={(e) =>
            setEditedLoan({
              ...editedLoan,
              educationDetails: {
                ...editedLoan.educationDetails,
                courseDuration: e.target.value,
              },
            })
          }
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Institute Location</p>
        <input
          type="text"
          value={editedLoan?.educationDetails?.instituteLocation || ""}
          onChange={(e) =>
            setEditedLoan({
              ...editedLoan,
              educationDetails: {
                ...editedLoan.educationDetails,
                instituteLocation: e.target.value,
              },
            })
          }
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Course Fee</p>
        <input
          type="number"
          value={editedLoan?.educationDetails?.courseFee || ""}
          onChange={(e) =>
            setEditedLoan({
              ...editedLoan,
              educationDetails: {
                ...editedLoan.educationDetails,
                courseFee: e.target.value,
              },
            })
          }
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Current Year of Study</p>
        <input
          type="text"
          value={editedLoan?.educationDetails?.studyYear || ""}
          onChange={(e) =>
            setEditedLoan({
              ...editedLoan,
              educationDetails: {
                ...editedLoan.educationDetails,
                studyYear: e.target.value,
              },
            })
          }
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Company Name</p>
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
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Job Title</p>
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
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Location</p>
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
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">Salary</p>
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
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      <div className="md:col-span-2">
        <p className="mb-2 text-sm font-semibold text-gray-600">Net Salary</p>
        <input
          type="number"
          value={editedLoan?.employmentDetails?.netHandSalary || editedLoan?.employmentDetails?.netsalary || ""}
          onChange={(e) =>
            setEditedLoan({
              ...editedLoan,
              employmentDetails: {
                ...editedLoan.employmentDetails,
                netHandSalary: e.target.value,
              },
            })
          }
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        />
      </div>
    </div>
  )}
</SectionCard>

          <SectionCard
            title="KYC Details"
            subtitle="Update identity and address information."
            right={
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12">
                <IdCard className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-600">Aadhaar Number</p>
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
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-600">PAN Number</p>
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
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div className="md:col-span-2">
                <p className="mb-2 text-sm font-semibold text-gray-600">Address</p>
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
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
};

export default AdminLoanDetails;