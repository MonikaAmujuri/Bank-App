import React from "react";
import { Link, useLocation } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const LoanSuccess = () => {
  const location = useLocation();
  const loanType = location.state?.loanType || "Loan";
  const loanAmount = location.state?.loanAmount || "";
  const referenceId = location.state?.referenceId || "";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <UserNavbar />

      <div className="mx-auto flex max-w-4xl px-4 py-16">
        <div className="w-full rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-green-600">
            Application Submitted
          </p>

          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Your loan application was submitted successfully
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-gray-600">
            We have received your application and it is now under review. You can
            track its status anytime from your applications page.
          </p>

          <div className="mx-auto mb-8 grid max-w-2xl gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Loan Type</p>
              <p className="mt-1 font-semibold text-gray-900">{loanType}</p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Loan Amount</p>
              <p className="mt-1 font-semibold text-gray-900">
                {loanAmount ? `₹${loanAmount}` : "N/A"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Reference</p>
              <p className="mt-1 font-semibold text-gray-900">
                {referenceId || "Generated Successfully"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/user/my-applications"
              className="rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              View My Applications
            </Link>

            <Link
              to="/user"
              className="rounded-xl border border-blue-900 px-6 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Back to Home
            </Link>

            <Link
              to="/user/apply-loan"
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Apply Another Loan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanSuccess;