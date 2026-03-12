import React from "react";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PublicNavbar from "../../components/user/PublicNavbar";
import UserNavbar from "../../components/user/UserNavbar";
import { loanData } from "../../data/loanData";

const LoanDetails = () => {
  const { type } = useParams();
  const loan = loanData[type];
  const location = useLocation();
const isUserRoute = location.pathname.startsWith("/user");

  if (!loan) {
    return (
      <div className="min-h-screen bg-white text-gray-800">
        <PublicNavbar />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-red-600">Loan not found</h1>
          <Link
            to="/loans"
            className="mt-6 inline-block rounded-xl bg-blue-900 px-6 py-3 text-white hover:bg-blue-800"
          >
            Back to Loans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {isUserRoute ? <UserNavbar /> : <PublicNavbar />}

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Loan Details
          </p>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            {loan.title}
          </h1>
          <p className="mb-6 text-xl text-blue-900">{loan.subtitle}</p>
          <p className="max-w-3xl text-lg text-gray-600">{loan.description}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-blue-900">
              Benefits
            </h2>
            <div className="space-y-3">
              {loan.benefits.map((item, index) => (
                <p key={index} className="text-gray-700">
                  • {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-blue-900">
              Eligibility
            </h2>
            <div className="space-y-3">
              {loan.eligibility.map((item, index) => (
                <p key={index} className="text-gray-700">
                  • {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-blue-900">
              Required Documents
            </h2>
            <div className="space-y-3">
              {loan.documents.map((item, index) => (
                <p key={index} className="text-gray-700">
                  • {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl bg-blue-900 px-8 py-14 text-center text-white shadow-xl">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to apply for {loan.title}?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-blue-100">
              Log in to continue your application and get started with a secure,
              simple banking experience.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
              to={isUserRoute ? "/user/apply-loan" : "/login"}
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
              >
            Apply Now
            </Link>

              <Link
              to={isUserRoute ? "/user" : "/loans"}
              className="rounded-xl border border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                {isUserRoute ? "Back to Home" : "Back to Loans"}
            </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoanDetails;