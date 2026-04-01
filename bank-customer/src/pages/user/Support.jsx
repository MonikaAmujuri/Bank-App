import React from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const supportTopics = [
  "Help with loan application",
  "Document upload support",
  "Application status clarification",
  "KYC update assistance",
  "General banking support",
  "Customer account guidance",
];

const contactCards = [
  {
    title: "Call Us",
    description: "Speak directly with our customer support team.",
    value: "+91 98765 43210",
    helper: "Best for urgent application help",
    icon: "📞",
  },
  {
    title: "Email Support",
    description: "Send your queries and we will respond as soon as possible.",
    value: "support@mybank.com",
    helper: "Best for document-related queries",
    icon: "✉️",
  },
  {
    title: "Working Hours",
    description: "Our team is available during these hours.",
    value: "Mon - Sat",
    subValue: "9:00 AM - 6:00 PM",
    helper: "Faster response during support hours",
    icon: "🕒",
  },
  {
    title: "Visit Branch",
    description: "You can also visit your nearest bank branch for assistance.",
    value: "In-branch Support",
    helper: "Best for in-person assistance",
    icon: "🏦",
  },
];

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <UserNavbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-0 top-12 h-56 w-56 rounded-full bg-blue-100 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
  <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
    <div className="max-w-3xl">
      <p className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-100/80 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
        Customer Support
      </p>

      <h1 className="mb-5 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
        We’re here to help you
      </h1>

      <p className="max-w-3xl text-lg leading-8 text-gray-600">
        Get support for your loan applications, uploaded documents, banking
        queries, and account-related assistance from our customer care team.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
          <p className="text-sm text-gray-500">Support Type</p>
          <p className="mt-1 text-lg font-bold text-gray-900">Customer Care</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
          <p className="text-sm text-gray-500">Availability</p>
          <p className="mt-1 text-lg font-bold text-blue-900">Mon - Sat</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
          <p className="text-sm text-gray-500">Response</p>
          <p className="mt-1 text-lg font-bold text-green-600">Fast & Helpful</p>
        </div>
      </div>
    </div>

    <div className="lg:justify-self-end">
      <div className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_50px_rgba(59,130,246,0.12)] backdrop-blur">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-2xl shadow-sm">
            💬
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Need Assistance?
            </p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900">
              Contact Support
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Call Us
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              +91 98765 43210
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Email Support
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              support@mybank.com
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Best For
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-gray-700">
              Loan applications, document upload issues, and application status support.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      </section>

      <section className="py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {contactCards.map((card, index) => (
              <div
                key={index}
                className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-200"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl shadow-sm">
                  {card.icon}
                </div>

                <h2 className="mb-3 text-xl font-semibold text-blue-900">
                  {card.title}
                </h2>

                <p className="min-h-[56px] text-gray-600">{card.description}</p>

                <p className="mt-5 text-xl font-bold text-gray-900">{card.value}</p>

                {card.subValue && (
                  <p className="mt-1 text-gray-700">{card.subValue}</p>
                )}

                <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Best For
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {card.helper}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
          <div className="rounded-[30px] bg-white p-7 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
                Popular Help Topics
              </p>
              <h2 className="text-3xl font-bold text-gray-900">
                Common Support Topics
              </h2>
              <p className="mt-3 text-gray-600">
                Explore the most common areas where customers usually need help.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {supportTopics.map((topic, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-7 text-white shadow-[0_25px_80px_rgba(30,64,175,0.35)]">
            <div className="mb-6">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-100">
                Quick Help
              </p>
              <h2 className="text-3xl font-bold">Need quick help?</h2>
              <p className="mt-4 max-w-xl leading-8 text-blue-100">
                For faster support, keep your loan ID or registered mobile number
                ready when contacting customer care.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p className="text-sm leading-7 text-blue-100">
                  <span className="font-semibold text-white">Best for:</span>{" "}
                  Application status, document issues, and loan queries
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p className="text-sm leading-7 text-blue-100">
                  <span className="font-semibold text-white">Keep ready:</span>{" "}
                  Loan ID, mobile number, and registered email
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p className="text-sm leading-7 text-blue-100">
                  <span className="font-semibold text-white">Response:</span>{" "}
                  Faster during working hours
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/user/my-applications"
                className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
              >
                View My Applications
              </Link>

              <Link
                to="/user"
                className="rounded-2xl border border-white px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;