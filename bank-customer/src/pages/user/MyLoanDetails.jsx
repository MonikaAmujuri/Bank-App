import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const MyLoanDetails = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLoanDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/user/my-loans/${loanId}`, {
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
        throw new Error(data.message || "Failed to fetch loan details");
      }

      setLoan(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoanDetails();
  }, [loanId]);

  const getStatusStyle = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "draft") return "bg-gray-100 text-gray-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div>
    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
      Loan Details
    </p>
    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
      My Loan Details
    </h1>
    <p className="mt-3 text-gray-600">
      View complete details of your loan application.
    </p>
  </div>

  <div className="flex flex-wrap gap-3">
    <Link
      to="/user/my-applications"
      className="inline-block rounded-xl border border-blue-900 px-5 py-2.5 font-medium text-blue-900 transition hover:bg-blue-50"
    >
      Back to Applications
    </Link>

    {loan && ["draft", "pending"].includes(loan.status) && (
      <Link
        to={`/user/my-applications/${loan.loanId}/edit`}
        className="inline-block rounded-xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800"
      >
        Edit Loan
      </Link>
    )}
  </div>
</div>

        {loading && (
          <div className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
            Loading loan details...
          </div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && loan && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {loan.loanDetails?.loanType || "Loan"}
                  </h2>
                  <p className="mt-1 text-gray-600">Loan ID: {loan.loanId}</p>
                </div>

                <span
                  className={`inline-flex rounded-full px-4 py-2 text-sm font-medium capitalize ${getStatusStyle(
                    loan.status
                  )}`}
                >
                  {loan.status}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Loan Amount</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    ₹{loan.loanDetails?.amount || 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {loan.loanDetails?.interestRate || "N/A"}%
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Tenure</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {loan.loanDetails?.tenure || "N/A"} months
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {loan.createdAt
                      ? new Date(loan.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-blue-900">
                  Employment Details
                </h3>

                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-semibold">Company Name:</span>{" "}
                    {loan.employmentDetails?.companyName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Company ID:</span>{" "}
                    {loan.employmentDetails?.companyId || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {loan.employmentDetails?.location || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Salary:</span>{" "}
                    ₹{loan.employmentDetails?.salary || 0}
                  </p>
                  <p>
                    <span className="font-semibold">Net Hand Salary:</span>{" "}
                    ₹{loan.employmentDetails?.netHandSalary || 0}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-blue-900">
                  KYC Details
                </h3>

                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-semibold">PAN Number:</span>{" "}
                    {loan.kycDetails?.panNumber || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Aadhaar Number:</span>{" "}
                    {loan.kycDetails?.aadharNumber || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {loan.kycDetails?.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
  <h3 className="mb-4 text-xl font-semibold text-blue-900">
    Uploaded Documents
  </h3>

  <div className="grid gap-4 md:grid-cols-2">
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="mb-2 font-semibold text-gray-900">PAN Card</p>
      {loan.kycDetails?.panFile ? (
        <a
          href={`http://localhost:5000/${loan.kycDetails.panFile.replace(/\\/g, "/")}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-700 hover:underline"
        >
          View PAN Card
        </a>
      ) : (
        <p className="text-red-500">Not uploaded</p>
      )}
    </div>

    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="mb-2 font-semibold text-gray-900">Aadhaar Card</p>
      {loan.kycDetails?.aadhaarFile ? (
        <a
          href={`http://localhost:5000/${loan.kycDetails.aadhaarFile.replace(/\\/g, "/")}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-700 hover:underline"
        >
          View Aadhaar Card
        </a>
      ) : (
        <p className="text-red-500">Not uploaded</p>
      )}
    </div>

    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="mb-2 font-semibold text-gray-900">Bank Statements</p>
      {loan.kycDetails?.bankStatements?.length > 0 ? (
        <div className="space-y-2">
          {loan.kycDetails.bankStatements.map((file, index) => (
            <a
              key={index}
              href={`http://localhost:5000/${file.replace(/\\/g, "/")}`}
              target="_blank"
              rel="noreferrer"
              className="block text-blue-700 hover:underline"
            >
              View Bank Statement {index + 1}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-red-500">Not uploaded</p>
      )}
    </div>

    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="mb-2 font-semibold text-gray-900">IT Returns</p>
      {loan.kycDetails?.itReturns?.length > 0 ? (
        <div className="space-y-2">
          {loan.kycDetails.itReturns.map((file, index) => (
            <a
              key={index}
              href={`http://localhost:5000/${file.replace(/\\/g, "/")}`}
              target="_blank"
              rel="noreferrer"
              className="block text-blue-700 hover:underline"
            >
              View IT Return {index + 1}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-red-500">Not uploaded</p>
      )}
    </div>

    <div className="rounded-2xl bg-gray-50 p-4 md:col-span-2">
      <p className="mb-2 font-semibold text-gray-900">Payslips</p>
      {loan.kycDetails?.payslips?.length > 0 ? (
        <div className="space-y-2">
          {loan.kycDetails.payslips.map((file, index) => (
            <a
              key={index}
              href={`http://localhost:5000/${file.replace(/\\/g, "/")}`}
              target="_blank"
              rel="noreferrer"
              className="block text-blue-700 hover:underline"
            >
              View Payslip {index + 1}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-red-500">Not uploaded</p>
      )}
    </div>
  </div>
</div>

            {loan.remarks && (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-xl font-semibold text-blue-900">Remarks</h3>
                <div className="rounded-2xl bg-gray-50 p-4 text-gray-700">
                  {loan.remarks}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLoanDetails;