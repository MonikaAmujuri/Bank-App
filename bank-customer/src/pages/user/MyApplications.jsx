import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/user/my-loans", {
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
        throw new Error(data.message || "Failed to fetch loans");
      }

      setApplications(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }
    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }
    if (status === "draft") {
      return "bg-gray-100 text-gray-700";
    }
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-8 py-10 shadow-sm ring-1 ring-blue-100 md:px-10">
            <div className="absolute inset-0 opacity-60">
              <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                  Loan Applications
                </p>
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  My Applications
                </h1>
                <p className="mt-3 text-gray-600 leading-7">
                  Track the status of your submitted loan applications and view
                  important details anytime.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:w-[360px]">
                <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-bold text-blue-900">
                    {applications.length}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">Applications</p>
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-bold text-blue-900">Track</p>
                  <p className="mt-1 text-xs text-gray-500">Progress</p>
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100 col-span-2 sm:col-span-1">
                  <p className="text-2xl font-bold text-blue-900">Easy</p>
                  <p className="mt-1 text-xs text-gray-500">Access</p>
                </div>
              </div>
            </div>
          </section>

          {loading && (
            <div className="rounded-[28px] bg-white p-6 text-gray-600 shadow-sm ring-1 ring-gray-100">
              Loading applications...
            </div>
          )}

          {error && (
            <div className="rounded-[28px] bg-red-50 p-6 text-red-600 shadow-sm ring-1 ring-red-100">
              {error}
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">
                No applications found
              </h2>
              <p className="mt-3 text-gray-600">
                You have not submitted any loan applications yet.
              </p>
              <Link
                to="/user/apply-loan"
                className="mt-6 inline-block rounded-2xl bg-blue-900 px-5 py-3 font-medium text-white transition hover:bg-blue-800"
              >
                Apply for a Loan
              </Link>
            </div>
          )}

          {!loading && !error && applications.length > 0 && (
            <div className="grid gap-6">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {app.loanDetails?.loanType || "Loan"}
                      </h2>
                      <p className="mt-1 text-gray-600">Loan ID: {app.loanId}</p>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-medium capitalize ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="grid gap-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700 md:grid-cols-2 xl:grid-cols-4">
                    <p>
                      <span className="font-semibold">Loan Amount:</span> ₹
                      {app.loanDetails?.amount || 0}
                    </p>
                    <p>
                      <span className="font-semibold">Interest Rate:</span>{" "}
                      {app.loanDetails?.interestRate || "N/A"}%
                    </p>
                    <p>
                      <span className="font-semibold">Tenure:</span>{" "}
                      {app.loanDetails?.tenure || "N/A"} months
                    </p>
                    <p>
                      <span className="font-semibold">Submitted On:</span>{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {app.remarks && (
                    <div className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm text-gray-700">
                      <span className="font-semibold text-blue-900">Remarks:</span>{" "}
                      {app.remarks}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      to={`/user/my-applications/${app.loanId}`}
                      className="inline-block rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;