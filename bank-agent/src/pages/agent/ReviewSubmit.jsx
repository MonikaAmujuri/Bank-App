import React from "react";

const ReviewSubmit = ({ loanData, status }) => {

  const headingText =
  status === "approved"
    ? "Approved Loan Summary"
    : status === "rejected"
    ? "Rejected Loan Summary"
    : "Review & Submit";

const subText =
  status === "approved"
    ? "This loan has been approved. Review the final submitted details below."
    : status === "rejected"
    ? "This loan has been rejected. Review the submitted details below."
    : "Please review all loan details carefully before submitting.";


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
  <div className="mx-auto max-w-6xl space-y-8">
    <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
            Final Review
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{headingText}</h2>
          <p className="mt-3 max-w-2xl text-indigo-100">{subText}</p>
        </div>

        <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-100">
            Current Status
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {loanData?.status || "Draft"}
          </p>
        </div>
      </div>
    </section>

    <div className="grid gap-8">
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Loan Details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Summary of selected loan information
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl text-indigo-600">
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
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Employment Details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Applicant work and income information
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
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
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              KYC Details
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Identity and address information
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl text-green-600">
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
      </section>

      {loanData?.kycDetails && (
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">
                Uploaded Documents
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Customer submitted files for verification
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-xl text-purple-600">
              📄
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="mb-3 text-sm font-medium text-gray-500">PAN Card</p>
              {loanData.kycDetails?.panFile ? (
                <a
                  href={loanData.kycDetails.panFile}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  View PAN Card
                </a>
              ) : (
                <p className="text-sm text-red-500">Not uploaded</p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="mb-3 text-sm font-medium text-gray-500">
                Aadhaar Card
              </p>
              {loanData.kycDetails?.aadhaarFile ? (
                <a
                  href={loanData.kycDetails.aadhaarFile}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  View Aadhaar Card
                </a>
              ) : (
                <p className="text-sm text-red-500">Not uploaded</p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="mb-3 text-sm font-medium text-gray-500">
                Bank Statements
              </p>
              {loanData.kycDetails?.bankStatements?.length > 0 ? (
                <div className="space-y-2">
                  {loanData.kycDetails.bankStatements.map((file, index) => (
                    <a
                      key={index}
                      href={file}
                      target="_blank"
                      rel="noreferrer"
                      className="block font-medium text-indigo-600 hover:underline"
                    >
                      View Bank Statement {index + 1}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-500">Not uploaded</p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="mb-3 text-sm font-medium text-gray-500">
                IT Returns
              </p>
              {loanData.kycDetails?.itReturns?.length > 0 ? (
                <div className="space-y-2">
                  {loanData.kycDetails.itReturns.map((file, index) => (
                    <a
                      key={index}
                      href={file}
                      target="_blank"
                      rel="noreferrer"
                      className="block font-medium text-indigo-600 hover:underline"
                    >
                      View IT Return {index + 1}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-500">Not uploaded</p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 md:col-span-2 xl:col-span-1">
              <p className="mb-3 text-sm font-medium text-gray-500">
                Payslips
              </p>
              {loanData.kycDetails?.payslips?.length > 0 ? (
                <div className="space-y-2">
                  {loanData.kycDetails.payslips.map((file, index) => (
                    <a
                      key={index}
                      href={file}
                      target="_blank"
                      rel="noreferrer"
                      className="block font-medium text-indigo-600 hover:underline"
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
        </section>
      )}
    </div>
  </div>
);
};

export default ReviewSubmit;