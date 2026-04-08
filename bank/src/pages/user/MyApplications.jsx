import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all")

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/user/my-loans", {
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
        throw new Error(data.message || "Failed to fetch loans");
      }

      setApplications(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getCustomerStatusStyle = (status) => {
    switch (status) {
      case "draft":
        return "border border-gray-200 bg-gray-100 text-gray-700";
      case "submitted":
        return "border border-blue-200 bg-blue-100 text-blue-700";
      case "under_review":
        return "border border-orange-200 bg-orange-100 text-orange-700";
      case "documents_pending":
        return "border border-purple-200 bg-purple-100 text-purple-700";
      case "approved":
        return "border border-green-200 bg-green-100 text-green-700";
      case "rejected":
        return "border border-red-200 bg-red-100 text-red-700";
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
        return "Submitted";
      default:
        return status || "-";
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

  const getStatusMessage = (status) => {
    switch (status) {
      case "draft":
        return "Your application is saved as a draft and can be completed anytime.";
      case "submitted":
      case "pending":
        return "Your application has been submitted successfully and is waiting for review.";
      case "under_review":
        return "Your application is currently being reviewed by the bank team.";
      case "documents_pending":
        return "Some supporting documents may still need attention or review.";
      case "approved":
        return "Great news — your application has been approved.";
      case "rejected":
        return "This application was not approved based on the review outcome.";
      case "disbursed":
        return "Your approved loan has been disbursed successfully.";
      default:
        return "Track your application progress and review the details here.";
    }
  };

  const getStatusSummaryTone = (status) => {
    switch (status) {
      case "draft":
        return "border-gray-200 bg-gray-50";
      case "submitted":
      case "pending":
        return "border-blue-100 bg-blue-50";
      case "under_review":
        return "border-orange-100 bg-orange-50";
      case "documents_pending":
        return "border-purple-100 bg-purple-50";
      case "approved":
        return "border-green-100 bg-green-50";
      case "rejected":
        return "border-red-100 bg-red-50";
      case "disbursed":
        return "border-emerald-100 bg-emerald-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getStageText = (status) => {
    switch (status) {
      case "draft":
        return "Current Stage: Draft Saved";
      case "submitted":
      case "pending":
        return "Current Stage: Application Submitted";
      case "under_review":
        return "Current Stage: Under Review";
      case "documents_pending":
        return "Current Stage: Documents Pending";
      case "approved":
        return "Current Stage: Approved";
      case "rejected":
        return "Current Stage: Rejected";
      case "disbursed":
        return "Current Stage: Loan Disbursed";
      default:
        return "Current Stage: In Progress";
    }
  };

  const filterTabs = [
    { key: "all", label: "All"},
    { key: "in_progress", label: "In Progress"},
    { key: "approved", label: "Approved"},
    { key: "rejected", label: "Rejected"},
    { key: "draft", label: "Draft"},
    { key: "documents_pending", label: "Documents Pending"},
  ]
  const getNormalisedStatus = (status) => {
    if (status === "pending") return "submitted";
    return status;
  }
  
  const filteredApplications = applications.filter((app) => {
    const normalizedStatus = getNormalisedStatus(app.status);

    if (activeFilter === "all") return true;

    if (activeFilter === "in_progress") {
      return ["submitted", "under_review", "documents_pending"].includes(
        normalizedStatus
      );
    }

    if (activeFilter === "approved") {
      return ["approved", "disbursed"].includes(normalizedStatus);
    }

    if (activeFilter === "rejected") {
      return normalizedStatus === "rejected";
    }

    if (activeFilter === "draft") {
      return normalizedStatus === "draft";
    }

    if (activeFilter === "documents_pending") {
      return normalizedStatus === "documents_pending";
    }

    return true;
  });


  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-8 py-10 shadow-[0_18px_50px_rgba(59,130,246,0.10)] ring-1 ring-blue-100 md:px-10">
            <div className="absolute inset-0 opacity-60">
              <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                  Loan Applications
                </p>
                <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
                  My Applications
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600">
                  Track the status of your submitted loan applications and view
                  important details anytime.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:w-[360px]">
                <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-bold text-blue-900">
                    {applications.length}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Applications</p>
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-bold text-blue-900">Track</p>
                  <p className="mt-1 text-xs text-gray-500">Progress</p>
                </div>
                <div className="col-span-2 rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100 sm:col-span-1">
                  <p className="text-2xl font-bold text-blue-900">Easy</p>
                  <p className="mt-1 text-xs text-gray-500">Access</p>
                </div>
              </div>
            </div>
          </section>

          <div className="rounded-[24px] border border-gray-100 bg-white p-3 shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-wrap gap=2">
              {filterTabs.map((tab) => (
                <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeFilter === tab.key
                  ? "border border-blue-200 bg-blue-50 text-blue-700"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filteredApplications.length}</span>{" "}
              application{filteredApplications.length !== 1 ? "s" : ""}
              {activeFilter !== "all" ? (
                <>
                {" "}for <span className="font-semibold text-blue-700">{filterTabs.find(tab => tab.key === activeFilter)?.label}</span>
                </>
              ) : null}
            </p>
          </div>

          {loading && (
            <div className="rounded-[28px] bg-white p-6 text-gray-600 shadow-sm ring-1 ring-gray-100">
              Loading applications...
            </div>
          )}

          {error && (
            <div className="rounded-[28px] bg-red-50 p-6 text-red-600 shadow-sm ring-1 ring-red-100">
              {error}
            </div>
          )}

          {!loading && !error && filteredApplications.length === 0 && (
            <div className="rounded-[30px] bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                📄
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                No applications found
              </h2>
              <p className="mt-3 text-gray-600">
                {activeFilter === "all"
                ? "You have not submitted any loan applications yet."
                : "No applications match the selected filter."}
              </p>
              <Link
                to="/user/apply-loan"
                className="mt-6 inline-block rounded-2xl bg-blue-900 px-5 py-3 font-medium text-white transition hover:bg-blue-800"
              >
                Apply for a Loan
              </Link>
            </div>
          )}

          {!loading && !error && filteredApplications.length > 0 && (
            <div className="grid gap-6">
              {filteredApplications.map((app) => (
                <div
                  key={app._id}
                  className={`rounded-[30px] border-l-4 bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md ${getStatusAccent(
                    app.status
                  )}`}
                >
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-2 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                        Application Record
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {app.loanDetails?.loanType || "Loan"}
                      </h2>
                      <p className="mt-1 text-gray-600">
                        Loan ID: <span className="font-medium">{app.loanId}</span>
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium ${getCustomerStatusStyle(
                        app.status
                      )}`}
                    >
                      {getCustomerStatusLabel(app.status)}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-blue-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                        Loan Amount
                      </p>
                      <p className="mt-3 text-lg font-bold text-gray-900">
                        ₹{app.loanDetails?.amount || 0}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-sky-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                        Interest Rate
                      </p>
                      <p className="mt-3 text-lg font-bold text-gray-900">
                        {app.loanDetails?.interestRate || "N/A"}%
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-cyan-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                        Tenure
                      </p>
                      <p className="mt-3 text-lg font-bold text-gray-900">
                        {app.loanDetails?.tenure || "N/A"} months
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-indigo-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                        Submitted On
                      </p>
                      <p className="mt-3 text-lg font-bold text-gray-900">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-5 rounded-[24px] border p-4 ${getStatusSummaryTone(
                      app.status
                    )}`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                          Status Summary
                        </p>
                        <p className="mt-2 text-sm font-semibold text-gray-900">
                          {getStageText(app.status)}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {getStatusMessage(app.status)}
                        </p>
                      </div>

                      <div
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getCustomerStatusStyle(
                          app.status
                        )}`}
                      >
                        {getCustomerStatusLabel(app.status)}
                      </div>
                    </div>
                  </div>

                  {app.remarks && (
                    <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-gray-700">
                      <span className="font-semibold text-blue-900">Remarks:</span>{" "}
                      {app.remarks}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">
                      Review full details, documents, and complete timeline in the detailed view.
                    </p>

                    <Link
                      to={`/user/my-applications/${app.loanId}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800"
                    >
                      <span>View Details</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;