import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const ReviewSubmit = ({ loanData, isEditable }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { loanId } = useParams();

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/loans/${loanId}/submit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed");
      }

      alert("Loan submitted successfully!");
      navigate("/agent/loans");
    } catch (err) {
      alert(err.message);
    }
  };

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

  const DetailItem = ({ label, value }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-base font-medium text-gray-900 break-words">{value}</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-500">
          Please review all loan details carefully before submitting.
        </p>
      </div>

      <div className="space-y-8">
        {/* Loan Details */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Loan Details
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Summary of selected loan information
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg">
              💰
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
        </div>

        {/* Employment Details */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Employment Details
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Applicant work and income information
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
              💼
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <DetailItem
              label="Company ID"
              value={formatText(loanData.employmentDetails?.companyId)}
            />
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
              label="Net Salary"
              value={formatCurrency(loanData.employmentDetails?.netSalary)}
            />
          </div>
        </div>

        {/* KYC Details */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                KYC Details
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Identity and address information
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-lg">
              🪪
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
        </div>
      </div>

      {isEditable && (
        <div className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              Ready to submit this loan?
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Once submitted, this loan will move forward for processing.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm transition"
          >
            Submit Loan
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmit;
