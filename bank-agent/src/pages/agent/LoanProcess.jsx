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

  useEffect(() => {
  console.log("Loan ID:", loanId);
  fetchLoan();
}, [loanId]);


  const fetchLoan = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/loans/${loanId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch loan");
    }

    const data = await res.json();
    setLoan(data);

  } catch (error) {
    console.error("Fetch loan error:", error);
    setLoan(null);
  } finally {
    setLoading(false); // VERY IMPORTANT
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
    const res = await fetch(
      `http://localhost:5000/api/loans/${loanId}/submit`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

 if (loading) return <div>Loading...</div>;

if (!loan) {
  return <div>Loan not found</div>;
}

// ⬇️ Only now use loan
const isEditable = ["draft", "pending"].includes(loan.status);

  return (
    
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">
        Loan ID: {loanId}
      </h1>
      <span
      className={`rounded-full px-3 py-1 text-sm ${
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
        {loan.status?.toUpperCase()}
      </span>

      {/* Step Indicator */}
      <div className="flex mb-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 text-center py-2 border-b-4 ${
              index === currentStep
                ? "border-indigo-600 font-semibold"
                : "border-gray-200 text-gray-400"
            }`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white p-8 rounded-2xl shadow-md">
        {currentStep === 0 && (
          <LoanDetails
            loan={loan}                    // ✅ pass full loan
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
    <ReviewSubmit loanData={loan} isEditable={isEditable} />

    {["draft", "pending"].includes(loan.status) && (
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSubmitApplication}
          className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
        >
          Approve Loan
        </button>

        <button
          onClick={handleReject}
          className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
        >
          Reject Loan
        </button>
      </div>
    )}
  </div>
)}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 border rounded-lg"
            >
              Back
            </button>
          )}

          {currentStep < steps.length - 1 && (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanProcess;