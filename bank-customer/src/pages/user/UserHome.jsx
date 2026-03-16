import React from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const services = [
  {
    title: "Apply Loan",
    description:
      "Start a new loan request with a smooth and secure application process.",
    link: "/user/apply-loan",
    button: "Apply Now",
  },
  {
    title: "My Applications",
    description:
      "View all your loan applications and track their latest status.",
    link: "/user/my-applications",
    button: "View Applications",
  },
  {
    title: "Uploaded Documents",
    description:
      "Manage your PAN card and Aadhaar documents in one place.",
    link: "/user/documents",
    button: "View Documents",
  },
  {
    title: "Support",
    description:
      "Get help with loan applications, document uploads, and account assistance.",
    link: "/user/support",
    button: "Get Help",
  },
];

const loanOptions = [
  {
    title: "Personal Loan",
    text: "Quick support for personal financial needs with simple processing.",
    link: "/user/loans/personal",
  },
  {
    title: "Home Loan",
    text: "Affordable loan options to help you buy or build your dream home.",
    link: "/user/loans/home",
  },
  {
    title: "Education Loan",
    text: "Flexible financial support for higher education and academic goals.",
    link: "/user/loans/education",
  },
  {
    title: "Vehicle Loan",
    text: "Easy financing options for your bike or car with smooth approval.",
    link: "/user/loans/vehicle",
  },
  {
    title: "Business Loan",
    text: "Support your business growth with trusted banking solutions.",
    link: "/user/loans/business",
  },
];

const UserHome = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <UserNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-blue-100 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 py-16 md:flex-row md:py-20 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              Customer Banking Portal
            </p>

            <h1 className="mb-5 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Welcome back to your secure banking space
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-8 text-gray-600">
              Manage your loans, upload important documents, and stay updated on
              your applications with a simple and customer-friendly experience.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/user/apply-loan"
                className="rounded-2xl bg-blue-900 px-6 py-3 font-medium text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                Apply Loan
              </Link>
              <Link
                to="/user/my-applications"
                className="rounded-2xl border border-blue-900 bg-white px-6 py-3 font-medium text-blue-900 transition hover:bg-blue-50"
              >
                My Applications
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-blue-100 bg-white/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-bold text-blue-900">Fast</p>
                <p className="mt-1 text-sm text-gray-500">Application process</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-white/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-bold text-blue-900">Secure</p>
                <p className="mt-1 text-sm text-gray-500">Document handling</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-white/80 px-4 py-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-bold text-blue-900">Easy</p>
                <p className="mt-1 text-sm text-gray-500">Status tracking</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] ring-1 ring-gray-100">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Banking Services</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    At a Glance
                  </h3>
                </div>
                <div className="rounded-2xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                  Secure
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-blue-50 p-5">
                  <p className="text-sm text-gray-500">Loan Applications</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    Apply and track with ease
                  </p>
                </div>

                <div className="rounded-3xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Document Management</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    Upload PAN and Aadhaar securely
                  </p>
                </div>

                <div className="rounded-3xl bg-cyan-50 p-5">
                  <p className="text-sm text-gray-500">Customer Support</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    Get help whenever you need it
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-900">24/7</p>
                  <p className="mt-1 text-xs text-gray-500">Support</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-900">Safe</p>
                  <p className="mt-1 text-xs text-gray-500">Process</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-900">Easy</p>
                  <p className="mt-1 text-xs text-gray-500">Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
              Our Services
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Everything you need in one place
            </h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              Access your most important banking and loan services quickly and
              securely.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((item, index) => (
              <div
                key={index}
                className="group rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-800">
                  {index + 1}
                </div>

                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>

                <p className="mb-6 min-h-[72px] text-sm leading-7 text-gray-600">
                  {item.description}
                </p>

                <Link
                  to={item.link}
                  className="inline-block rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                  {item.button}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Options */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
              Loan Services
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Explore the right loan for your needs
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Choose from our trusted loan options designed for different life
              goals and financial needs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loanOptions.map((loan, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md"
              >
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {loan.title}
                </h3>
                <p className="mb-5 text-sm leading-7 text-gray-600">
                  {loan.text}
                </p>
                <Link
                  to={loan.link}
                  className="text-sm font-semibold text-blue-700 hover:underline"
                >
                  Explore Loan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents + Applications */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
          <div className="rounded-[30px] bg-white p-7 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-3 text-2xl font-semibold text-blue-900">
              Manage Your Documents
            </h3>
            <p className="mb-6 leading-7 text-gray-600">
              Keep your PAN card and Aadhaar card updated for a smoother loan
              application experience.
            </p>
            <Link
              to="/user/documents"
              className="inline-block rounded-xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800"
            >
              Go to Documents
            </Link>
          </div>

          <div className="rounded-[30px] bg-white p-7 shadow-sm ring-1 ring-gray-100">
            <h3 className="mb-3 text-2xl font-semibold text-blue-900">
              Check Your Applications
            </h3>
            <p className="mb-6 leading-7 text-gray-600">
              View all your submitted and agent-created loan applications and
              follow their progress.
            </p>
            <Link
              to="/user/my-applications"
              className="inline-block rounded-xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800"
            >
              View My Applications
            </Link>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-[32px] bg-blue-900 px-8 py-12 text-white shadow-[0_20px_50px_rgba(30,64,175,0.20)] md:px-12">
            <h2 className="mb-4 text-3xl font-bold">
              Need help with your banking services?
            </h2>
            <p className="mb-8 max-w-2xl leading-8 text-blue-100">
              Our support team is here to assist you with your loan applications,
              documents, and account-related queries.
            </p>

            <div className="mb-8 grid gap-4 text-blue-100 md:grid-cols-3">
              <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p>
                  <span className="font-semibold text-white">Email:</span>{" "}
                  support@mybank.com
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p>
                  <span className="font-semibold text-white">Phone:</span> +91
                  98765 43210
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p>
                  <span className="font-semibold text-white">Hours:</span> Mon -
                  Sat, 9 AM - 6 PM
                </p>
              </div>
            </div>

            <Link
              to="/user/my-applications"
              className="inline-block rounded-2xl bg-white px-6 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Continue Banking
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserHome;