import React from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../../components/user/PublicNavbar";

const loans = [
  {
    title: "Personal Loan",
    description:
      "Get quick financial support for personal expenses with simple documentation and fast approval.",
    points: ["Fast approval", "Minimal documents", "Flexible EMI"],
    link: "/loans/personal",
  },
  {
    title: "Home Loan",
    description:
      "Turn your dream home into reality with affordable interest rates and easy repayment options.",
    points: ["Affordable EMI", "High loan amount", "Long tenure"],
    link: "/loans/home",
  },
  {
    title: "Education Loan",
    description:
      "Support your higher education goals with convenient repayment and student-friendly options.",
    points: ["Student-friendly", "Flexible repayment", "Quick processing"],
    link: "/loans/education",
  },
  {
    title: "Business Loan",
    description:
      "Grow your business with reliable funding for expansion, operations, and working capital needs.",
    points: ["Business growth", "Flexible tenure", "Easy documentation"],
    link: "/loans/business",
  },
  {
    title: "Vehicle Loan",
    description:
      "Own your dream bike or car with easy financing and quick approval from our trusted bank.",
    points: ["Quick approval", "Easy financing", "Low down payment"],
    link: "/loans/vehicle",
  },
];

const Loans = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
        <PublicNavbar />
      {/* Hero / Page Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Loan Services
          </p>
          <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
            Find the Right Loan for Your Needs
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Explore our secure and flexible loan options designed to support
            your personal, home, education, and vehicle goals with confidence.
          </p>
        </div>
      </section>

      {/* Loan Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {loans.map((loan, index) => (
              <div
                key={index}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-800">
                  {index + 1}
                </div>

                <h2 className="mb-3 text-2xl font-semibold text-gray-900">
                  {loan.title}
                </h2>

                <p className="mb-5 text-gray-600">{loan.description}</p>

                <div className="mb-6 space-y-2">
                  {loan.points.map((point, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      • {point}
                    </p>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    to={loan.link}
                    className="rounded-xl bg-blue-900 px-4 py-2.5 text-center font-medium text-white transition hover:bg-blue-800"
                  >
                    View Details
                  </Link>

                  <Link
                    to="/user/apply-loan"
                    className="rounded-xl border border-blue-900 px-4 py-2.5 text-center font-medium text-blue-900 transition hover:bg-blue-50"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Loans */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Why Choose Our Loans
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              We make borrowing simple, transparent, and customer-friendly with
              trusted banking support at every step.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold text-blue-900">
                Quick Approval
              </h3>
              <p className="text-gray-600">
                Faster processing so you can move forward without delays.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold text-blue-900">
                Flexible EMI
              </h3>
              <p className="text-gray-600">
                Repayment options designed to suit your comfort and budget.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold text-blue-900">
                Trusted Support
              </h3>
              <p className="text-gray-600">
                Our team is here to guide you through the process with care.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold text-blue-900">
                Secure Process
              </h3>
              <p className="text-gray-600">
                Safe and reliable banking procedures for every application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl bg-blue-900 px-8 py-14 text-center text-white shadow-xl">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to apply for a loan?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-blue-100">
              Log in to continue your banking journey and choose the loan option
              that fits your goals best.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Login to Apply
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Loans;