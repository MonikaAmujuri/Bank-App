import React from "react";
import { useState, useEffect } from "react";
import { IndianRupee } from "lucide-react";

const loanRules = {
  "Personal Loan": {
    tenures: [12, 24, 36, 48, 60],
    slabs: [
      { min: 0, max: 200000, rate: 15.5 },
      { min: 200001, max: 500000, rate: 14.0 },
      { min: 500001, max: Infinity, rate: 12.5 },
    ],
  },
  "Home Loan": {
    tenures: [60, 120, 180, 240],
    slabs: [
      { min: 0, max: 1000000, rate: 9.0 },
      { min: 1000001, max: 3000000, rate: 8.75 },
      { min: 3000001, max: Infinity, rate: 8.5 },
    ],
  },
  "Education Loan": {
    tenures: [12, 24, 36, 48, 60, 72, 84],
    slabs: [
      { min: 0, max: 300000, rate: 10.5 },
      { min: 300001, max: 700000, rate: 9.75 },
      { min: 700001, max: Infinity, rate: 9.0 },
    ],
  },
  "Business Loan": {
    tenures: [12, 24, 36, 48, 60],
    slabs: [
      { min: 0, max: 500000, rate: 14.5 },
      { min: 500001, max: 1000000, rate: 13.75 },
      { min: 1000001, max: Infinity, rate: 13.0 },
    ],
  },
  "Vehicle Loan": {
    tenures: [12, 24, 36, 48, 60, 72],
    slabs: [
      { min: 0, max: 300000, rate: 11.5 },
      { min: 300001, max: 800000, rate: 11.0 },
      { min: 800001, max: Infinity, rate: 10.5 },
    ],
  },
};

const getInterestRateByAmount = (selectedLoanType, enteredAmount) => {
  if (!selectedLoanType || !enteredAmount) return "";

  const numericAmount = Number(enteredAmount);
  if (!numericAmount || numericAmount <= 0) return "";

  const selectedRule = loanRules[selectedLoanType];
  if (!selectedRule?.slabs) return "";

  const matchedSlab = selectedRule.slabs.find(
    (slab) => numericAmount >= slab.min && numericAmount <= slab.max
  );

  return matchedSlab ? String(matchedSlab.rate) : "";
};

const LoanDetails = ({ loan, data, isEditable, onSave }) => {
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [loanType, setLoanType] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [errors, setErrors] = useState({});
  const validateNumbersOnly = (value) => /^\d+(\.\d+)?$/.test(String(value).trim());

  useEffect(() => {
    if (data) {
      setAmount(data.amount || "");
      setTenure(data.tenure || "");
      setLoanType(data.loanType || "");
      setInterestRate(data.interestRate || "");
    }
  }, [data]);

  useEffect(() => {
    if (!loanType) {
      setInterestRate("");
      setTenure("");
      return;
    }

    const selectedRule = loanRules[loanType];

    if (selectedRule) {
      const calculatedRate = getInterestRateByAmount(loanType, amount);
      setInterestRate(calculatedRate);

      if (!selectedRule.tenures.includes(Number(tenure))) {
        setTenure("");
      }
    }
  }, [loanType, amount]);

  const handleSaveClick = () => {
    const newErrors = {};

    const trimmedAmount = String(amount).trim();
    const trimmedLoanType = String(loanType).trim();
    const trimmedInterestRate = String(interestRate).trim();
    const trimmedTenure = String(tenure).trim();

    if (!trimmedAmount) {
      newErrors.amount = "Amount is required";
    } else if (!validateNumbersOnly(trimmedAmount)) {
      newErrors.amount = "Enter only numbers";
    } else if (Number(trimmedAmount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!trimmedLoanType) {
      newErrors.loanType = "Loan type is required";
    }

    if (!trimmedInterestRate) {
      newErrors.interestRate = "Interest rate is required";
    }

    if (!trimmedTenure) {
      newErrors.tenure = "Tenure is required";
    } else if (Number(trimmedTenure) <= 0) {
      newErrors.tenure = "Tenure must be greater than 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave("loanDetails", {
      amount: trimmedAmount,
      loanType: trimmedLoanType,
      interestRate: trimmedInterestRate,
      tenure: trimmedTenure,
    });
  };

  const getFieldClass = (fieldName) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
      errors[fieldName] ? "border-red-300" : "border-gray-300"
    }`;

  const tenureOptions = loanType ? loanRules[loanType]?.tenures || [] : [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {loan?.userObjectId?.isDeleted && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          This loan belongs to an inactive user.
        </div>
      )}

      <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Loan Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and update the core loan information.
            </p>
          </div>

          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Loan Amount
            </label>

            {isEditable ? (
              <>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAmount(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({ ...prev, amount: "Amount is required" }));
                    } else if (!/^\d+$/.test(value.trim())) {
                      setErrors((prev) => ({ ...prev, amount: "Enter only numbers" }));
                    } else if (Number(value) <= 0) {
                      setErrors((prev) => ({
                        ...prev,
                        amount: "Amount must be greater than 0",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, amount: "" }));
                    }
                  }}
                  className={getFieldClass("amount")}
                  placeholder="Enter loan amount"
                  required
                />
                {errors.amount && (
                  <p className="mt-2 text-sm text-red-500">{errors.amount}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Interest rate will be auto-calculated based on loan type and amount slab.
                </p>
              </>
            ) : (
              <p className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                ₹ {amount || 0}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Loan Type
            </label>

            {isEditable ? (
              <>
                <select
                  value={loanType}
                  onChange={(e) => {
                    setLoanType(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      loanType: "",
                      interestRate: "",
                      tenure: "",
                    }));
                  }}
                  className={getFieldClass("loanType")}
                  required
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
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {loanType || "N/A"}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Interest Rate (%)
            </label>

            {isEditable ? (
              <>
                <input
                  type="text"
                  value={interestRate ? `${interestRate}%` : ""}
                  readOnly
                  className={`${getFieldClass("interestRate")} bg-gray-100 text-gray-600`}
                  placeholder="Auto-filled from loan type and amount"
                />
                {errors.interestRate && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.interestRate}
                  </p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {interestRate ? `${interestRate}%` : "0%"}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Tenure (Months)
            </label>

            {isEditable ? (
              <>
                <select
                  value={tenure}
                  onChange={(e) => {
                    setTenure(e.target.value);
                    setErrors((prev) => ({ ...prev, tenure: "" }));
                  }}
                  className={getFieldClass("tenure")}
                  required
                  disabled={!loanType}
                >
                  <option value="">
                    {loanType ? "Select Tenure" : "Select loan type first"}
                  </option>
                  {tenureOptions.map((month) => (
                    <option key={month} value={month}>
                      {month} Months
                    </option>
                  ))}
                </select>
                {errors.tenure && (
                  <p className="mt-2 text-sm text-red-500">{errors.tenure}</p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {tenure ? `${tenure} Months` : "0 Months"}
              </p>
            )}
          </div>
        </div>

        {isEditable && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-start">
            <button
              onClick={handleSaveClick}
              className="w-full sm:w-auto rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
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