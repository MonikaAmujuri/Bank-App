import React from "react";

const ReviewSubmit = ({ loanData }) => {
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
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="break-words text-base font-medium text-gray-900">{value}</p>
    </div>
  );

  const loan = loanData || {};

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-semibold text-gray-900">
          Review & Submit
        </h2>
        <p className="text-gray-500">
          Please review all loan details carefully before submitting.
        </p>
      </div>

      <div className="space-y-8">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Loan Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Summary of selected loan information
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-lg text-indigo-600">
              💰
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Employment Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Applicant work and income information
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-600">
              💼
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              label="Net Hand Salary"
              value={formatCurrency(loanData.employmentDetails?.netHandSalary)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                KYC Details
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Identity and address information
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg text-green-600">
              🪪
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

        {loan?.kycDetails && (
  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
      Uploaded Documents
    </h2>
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg text-green-600">
              🪪
            </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div className="rounded-xl border bg-white border-gray-200 p-4">
        <p className="mb-2 font-medium text-gray-800">PAN Card</p>
        {loan.kycDetails?.panFile ? (
          <a
            href={loan.kycDetails.panFile}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            View PAN Card
          </a>
        ) : (
          <p className="text-sm text-red-500">Not uploaded</p>
        )}
      </div>

      <div className="rounded-xl border bg-white border-gray-200 p-4">
        <p className="mb-2 font-medium text-gray-800">Aadhaar Card</p>
        {loan.kycDetails?.aadhaarFile ? (
          <a
            href={loan.kycDetails.aadhaarFile}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Aadhaar Card
          </a>
        ) : (
          <p className="text-sm text-red-500">Not uploaded</p>
        )}
      </div>

      <div className="rounded-xl border bg-white border-gray-200 p-4">
        <p className="mb-2 font-medium text-gray-800">Bank Statements</p>
        {loan.kycDetails?.bankStatements?.length > 0 ? (
          <div className="space-y-2">
            {loan.kycDetails.bankStatements.map((file, index) => (
              <a
                key={index}
                href={loan.kycDetails.bankStatements[index]}
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 hover:underline"
              >
                View Bank Statement {index + 1}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-red-500">Not uploaded</p>
        )}
      </div>

      <div className="rounded-xl border bg-white border-gray-200 p-4">
        <p className="mb-2 font-medium text-gray-800">IT Returns</p>
        {loan.kycDetails?.itReturns?.length > 0 ? (
          <div className="space-y-2">
            {loan.kycDetails.itReturns.map((file, index) => (
              <a
                key={index}
                href={loan.kycDetails.itReturns[index]}
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 hover:underline"
              >
                View IT Return {index + 1}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-red-500">Not uploaded</p>
        )}
      </div>

      <div className="rounded-xl border bg-white border-gray-200 p-4">
        <p className="mb-2 font-medium text-gray-800">Payslips</p>
        {loan.kycDetails?.payslips?.length > 0 ? (
          <div className="space-y-2">
            {loan.kycDetails.payslips.map((file, index) => (
              <a
                key={index}
                href={loan.kycDetails.payslips[index] }
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 hover:underline"
              >
                View Payslip {index + 1}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-red-500">Not uploaded</p>
        )}
      </div>
    </div>
    
  </div>
)}
      </div>
    </div>
  );
};

export default ReviewSubmit;