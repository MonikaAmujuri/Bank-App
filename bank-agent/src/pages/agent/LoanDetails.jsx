import React from "react";
import { useState, useEffect } from "react";

const LoanDetails = ({ loan, data, isEditable, onSave }) => {
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [loanType, setLoanType] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [errors, setErrors] = useState({});


  // Load existing data when component mounts
  useEffect(() => {
    if (data) {
      setAmount(data.amount || "");
      setLoanType(data.loanType || "");
      setTenure(data.tenure || "");
      setInterestRate(data.interestRate || "");
    }
  }, [data]);

  const handleSaveClick = () => {
  const newErrors = {};

  if (!amount) newErrors.amount = "Amount is required";
  if (!loanType) newErrors.loanType = "Loan type is required";
  if (!interestRate) newErrors.interestRate = "Interest rate is required";
  if (!tenure) newErrors.tenure = "Tenure is required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  onSave("loanDetails", { amount, loanType, interestRate, tenure });
};

  return (
  <div className="space-y-8">
    {loan?.userObjectId?.isDeleted && (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
        This loan belongs to an inactive user.
      </div>
    )}

    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Loan Details</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and update the core loan information.
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl text-indigo-600">
          💰
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Loan Amount
          </label>

          {isEditable ? (
            <>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Enter loan amount"
              />
              {errors.amount && (
                <p className="mt-2 text-sm text-red-500">{errors.amount}</p>
              )}
            </>
          ) : (
            <p className="text-xl font-semibold text-gray-900">
              ₹ {amount || 0}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Loan Type
          </label>

          {isEditable ? (
            <>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select Loan Type</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Vehicle Loan">Vehicle Loan</option>
              </select>
              {errors.loanType && (
                <p className="mt-2 text-sm text-red-500">{errors.loanType}</p>
              )}
            </>
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {loanType || "-"}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Interest Rate (%)
          </label>

          {isEditable ? (
            <>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Enter interest rate"
              />
              {errors.interestRate && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.interestRate}
                </p>
              )}
            </>
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {interestRate ? `${interestRate}%` : "-"}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Tenure (Months)
          </label>

          {isEditable ? (
            <>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Enter tenure"
              />
              {errors.tenure && (
                <p className="mt-2 text-sm text-red-500">{errors.tenure}</p>
              )}
            </>
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {tenure ? `${tenure} Months` : "-"}
            </p>
          )}
        </div>
      </div>

      {isEditable && (
        <div className="mt-8 flex justify-start">
          <button
            onClick={handleSaveClick}
            className="rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
          >
            Save Loan Details
          </button>
        </div>
      )}
    </div>
  </div>
);
};

export default LoanDetails;