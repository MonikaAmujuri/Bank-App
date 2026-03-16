import React from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../../components/user/PublicNavbar";

const loanTypes = [
  {
    title: "Personal Loan",
    description: "Quick funds for your personal needs with simple documentation.",
  },
  {
    title: "Home Loan",
    description: "Make your dream home a reality with affordable repayment plans.",
  },
  {
    title: "Education Loan",
    description: "Support your academic goals with flexible loan options.",
  },
  {
    title: "Business Loan",
    description: "Support your business ventures with flexible loan options.",
  },
  {
    title: "Vehicle Loan",
    description: "Own your dream vehicle with fast approval and easy EMI options.",
  },
];

const features = [
  "Fast Loan Approval",
  "Secure Banking Process",
  "Flexible Repayment Options",
  "Trusted Customer Support",
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-blue-100 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-14 px-6 py-20 md:flex-row md:py-24 lg:py-28">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
              Trusted Banking Solutions
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Secure Banking and Smart Loans for Every Stage of Life
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-8 text-gray-600">
              Experience reliable banking services and explore loan options
              designed to support your education, home, personal, and vehicle
              needs.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/loans"
                className="rounded-2xl bg-blue-900 px-6 py-3 font-medium text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                Explore Loans
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-blue-900 bg-white px-6 py-3 font-medium text-blue-900 transition hover:bg-blue-50"
              >
                Login
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-blue-100 bg-white/80 px-4 py-4 text-sm font-medium text-gray-700 shadow-sm backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-xl">
            <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] ring-1 ring-gray-100">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Loan Approval</p>
                  <h3 className="text-2xl font-bold text-gray-900">Fast & Easy</h3>
                </div>
                <div className="rounded-2xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                  Secure
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl bg-blue-50 p-5">
                  <p className="text-sm text-gray-500">Personal Loan</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    Quick access to funds
                  </p>
                </div>

                <div className="rounded-3xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Home Loan</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    Affordable repayment plans
                  </p>
                </div>

                <div className="rounded-3xl bg-cyan-50 p-5">
                  <p className="text-sm text-gray-500">Education Loan</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    Support your future goals
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-900">24/7</p>
                  <p className="mt-1 text-xs text-gray-500">Support</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-900">100%</p>
                  <p className="mt-1 text-xs text-gray-500">Secure</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-900">Easy</p>
                  <p className="mt-1 text-xs text-gray-500">Process</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Loans Section */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-700">
              About Our Loans
            </p>
            <h2 className="mb-5 text-3xl font-bold text-gray-900 md:text-4xl">
              Financial solutions built around your needs
            </h2>
            <p className="mb-8 text-lg leading-8 text-gray-600">
              We provide simple, transparent, and customer-friendly loan services
              that help you achieve life goals with confidence. From personal
              needs to home ownership and education support, our bank is here to
              guide you.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-blue-900">
                  Fast Approval
                </h3>
                <p className="text-sm leading-6 text-gray-600">
                  Faster loan processing with minimal waiting time.
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-blue-900">
                  Low Documentation
                </h3>
                <p className="text-sm leading-6 text-gray-600">
                  Simple documentation for a smoother experience.
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-blue-900">
                  Flexible EMI
                </h3>
                <p className="text-sm leading-6 text-gray-600">
                  Repayment options designed for your financial comfort.
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="mb-2 text-lg font-semibold text-blue-900">
                  Trusted Support
                </h3>
                <p className="text-sm leading-6 text-gray-600">
                  Dedicated assistance through every loan step.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-white shadow-[0_20px_50px_rgba(30,64,175,0.22)] md:p-10">
            <h3 className="mb-4 text-2xl font-bold">Why customers trust us</h3>
            <p className="mb-8 leading-7 text-blue-100">
              Our goal is to make banking and loans easier, safer, and more
              accessible for every customer.
            </p>

            <div className="space-y-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white/10 px-4 py-4 text-sm font-medium backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types Section */}
      <section className="bg-gray-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-700">
              Our Loan Services
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Choose the right loan for your needs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Explore flexible loan options tailored for personal goals, home
              ownership, education, business, and vehicles.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {loanTypes.map((loan, index) => (
              <div
                key={index}
                className="group rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-800">
                  {index + 1}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {loan.title}
                </h3>
                <p className="mb-6 min-h-[72px] text-sm leading-7 text-gray-600">
                  {loan.description}
                </p>
                <Link
                  to="/login"
                  className="inline-flex rounded-xl bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[32px] bg-blue-900 px-8 py-14 text-center text-white shadow-[0_20px_50px_rgba(30,64,175,0.20)] md:px-16">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Need financial support today?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-blue-100">
              Start your journey with secure banking services and flexible loan
              options designed for your future.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-2xl bg-white px-6 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-2xl font-bold text-blue-900">MyBank</h3>
            <p className="max-w-sm leading-7 text-gray-600">
              Secure, trusted, and customer-focused banking solutions for every
              need.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold text-gray-900">
              Quick Links
            </h4>
            <div className="space-y-2 text-gray-600">
              <p>Home</p>
              <p>Loans</p>
              <p>Login</p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold text-gray-900">Contact</h4>
            <div className="space-y-2 text-gray-600">
              <p>Email: support@mybank.com</p>
              <p>Phone: +91 98765 43210</p>
              <p>Location: India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          © 2026 MyBank. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;