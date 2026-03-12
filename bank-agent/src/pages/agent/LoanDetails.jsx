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
  <div className="space-y-6">
    {loan?.userObjectId?.isDeleted && (
  <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
    This loan belongs to an inactive user.
  </div>
)}

    {/* Loan Amount */}
    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Loan Amount
      </label>

      {isEditable ? (
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <p className="text-lg font-semibold text-gray-800">
          ₹ {amount || 0}
        </p>
      )}
    </div>

    {/* Loan Type */}
    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Loan Type
      </label>

      {isEditable ? (
        <select
          value={loanType}
          onChange={(e) => setLoanType(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">Select Loan Type</option>
          <option value="personal">Personal Loan</option>
          <option value="home">Home Loan</option>
          <option value="education">Education Loan</option>
          <option value="business">Business Loan</option>
          <option value="vehicle">Vehicle Loan</option>
        </select>
      ) : (
        <p className="text-lg font-medium text-gray-800 capitalize">
          {loanType || "-"}
        </p>
      )}
    </div>

    {/* Interest Rate */}
    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Interest Rate (%)
      </label>

      {isEditable ? (
        <input
          type="number"
          step="0.1"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <p className="text-lg font-medium text-gray-800">
          {interestRate ? `${interestRate}%` : "-"}
        </p>
      )}
    </div>

    {/* Tenure */}
    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Tenure (Months)
      </label>

      {isEditable ? (
        <input
          type="number"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <p className="text-lg font-medium text-gray-800">
          {tenure ? `${tenure} Months` : "-"}
        </p>
      )}
    </div>

    {/* Save Button */}
    {isEditable && (
      <div className="pt-4">
        <button
          onClick={handleSaveClick}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Save
        </button>
      </div>
    )}

  </div>
);
};

export default LoanDetails;