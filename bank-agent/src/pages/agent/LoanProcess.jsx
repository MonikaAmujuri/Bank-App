import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoanDetails from "./LoanDetails";
import EmploymentDetails from "./EmploymentDetails";
import KYCDetails from "./KYCDetails";
import ReviewSubmit from "./ReviewSubmit";

const steps = [
  "Loan Details",
  "Employment Details",
  "KYC Details",
  "Review & Submit",
];

const LoanProcess = () => {
  const { loanId } = useParams();
  const { token } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    fetchLoan();
  }, [loanId]);

  const fetchLoan = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/loans/${loanId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch loan");
      }

      const data = await res.json();
      setLoan(data);
    } catch (error) {
      console.error("Fetch loan error:", error);
      setLoan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/loans/${loanId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section,
          data: updatedData,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || `Failed to update ${section}`);
      }

      await fetchLoan();
      alert(result.message || "Saved successfully");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const res = await fetch(`http://localhost:5000/api/loans/${loanId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ remarks: reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reject");
      }

      await fetchLoan();
      alert("Loan rejected successfully");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  };

  const handleSubmitApplication = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/loans/${loanId}/submit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      await fetchLoan();
      alert("Application submitted successfully");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  };

  const handleUpdateStatus = async (selectedStatus, statusNote) => {
    if (!selectedStatus) {
      setStatusError("Please select a status");
      return;
    }

    if (!statusNote || !statusNote.trim()) {
      setStatusError("Please enter a note before updating the status");
      return;
    }

    try {
      setStatusUpdating(true);
      setStatusError("");
      setStatusMessage("");

      const res = await fetch(
        `http://localhost:5000/api/agent/loans/${loan.loanId}/status`,
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
      await fetchLoan();
    } catch (error) {
      console.error(error);
      setStatusError(error.message || "Something went wrong");
    } finally {
      setStatusUpdating(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

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
        return "bg-white/20 text-white";
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

  if (loading) return <div>Loading...</div>;

  if (!loan) {
    return <div>Loan not found</div>;
  }

  const isEditable = ["draft", "pending", "submitted", "under_review"].includes(
    loan.status
  );
  const isReviewOnly = ["approved", "rejected", "disbursed"].includes(loan.status);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Loan Workflow
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">Loan ID: {loanId}</h1>
            <p className="mt-3 max-w-2xl text-indigo-100">
              Review, update, and manage this loan application through each stage
              of the process.
            </p>
          </div>

          <div
            className={`inline-flex w-fit rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm ${getStatusClasses(
              loan.status
            )}`}
          >
            {getStatusLabel(loan.status)}
          </div>
        </div>
      </section>

      {statusError && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {statusError}
        </div>
      )}

      {statusMessage && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {statusMessage}
        </div>
      )}

      {isReviewOnly ? (
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <ReviewSubmit
            loanData={loan}
            status={loan.status}
            onUpdateStatus={handleUpdateStatus}
            statusUpdating={statusUpdating}
          />
        </section>
      ) : (
        <>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Loan Journey
              </h2>
              <p className="mt-1 text-gray-500">
                Complete each section before final approval or rejection.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border px-4 py-4 text-center transition ${
                    index === currentStep
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-widest">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-sm">
            {currentStep === 0 && (
              <LoanDetails
                loan={loan}
                data={loan.loanDetails}
                isEditable={isEditable}
                onSave={handleSave}
              />
            )}

            {currentStep === 1 && (
              <EmploymentDetails
                data={loan.employmentDetails}
                isEditable={isEditable}
                onSave={handleSave}
              />
            )}

            {currentStep === 2 && (
              <KYCDetails
                data={loan.kycDetails}
                isEditable={isEditable}
                onSave={handleSave}
              />
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <ReviewSubmit
                  loanData={loan}
                  status={loan.status}
                  onUpdateStatus={handleUpdateStatus}
                  statusUpdating={statusUpdating}
                />

                {["draft", "pending", "submitted", "under_review"].includes(
                  loan.status
                ) && (
                  <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-6">
                    <button
                      onClick={handleSubmitApplication}
                      className="rounded-2xl bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
                    >
                      Submit Loan
                    </button>

                    {["pending", "submitted", "under_review"].includes(
                      loan.status
                    ) && (
                      <button
                        onClick={handleReject}
                        className="rounded-2xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
                      >
                        Reject Loan
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-between border-t border-gray-100 pt-6">
              <div>
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="rounded-2xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
              </div>

              <div>
                {currentStep < steps.length - 1 && (
                  <button
                    onClick={nextStep}
                    className="rounded-2xl bg-indigo-600 px-6 py-2.5 font-medium text-white transition hover:bg-indigo-700"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default LoanProcess;