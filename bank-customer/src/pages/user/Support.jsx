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

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <UserNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <p className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            Customer Support
          </p>

          <h1 className="mb-5 text-4xl font-bold text-gray-900 md:text-5xl">
            We’re here to help you
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-gray-600">
            Get support for your loan applications, uploaded documents, banking
            queries, and account-related assistance from our customer care team.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-blue-900">Call Us</h2>
            <p className="text-gray-600">Speak directly with our customer support team.</p>
            <p className="mt-4 text-lg font-semibold text-gray-900">+91 98765 43210</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-blue-900">Email Support</h2>
            <p className="text-gray-600">Send your queries and we will respond as soon as possible.</p>
            <p className="mt-4 text-lg font-semibold text-gray-900">support@mybank.com</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-blue-900">Working Hours</h2>
            <p className="text-gray-600">Our team is available during these hours.</p>
            <p className="mt-4 text-lg font-semibold text-gray-900">Mon - Sat</p>
            <p className="text-gray-700">9:00 AM - 6:00 PM</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-blue-900">Visit Branch</h2>
            <p className="text-gray-600">You can also visit your nearest bank branch for assistance.</p>
            <p className="mt-4 text-lg font-semibold text-gray-900">In-branch Support</p>
          </div>
        </div>
      </section>

      {/* Help Topics */}
      <section className="pb-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-blue-900">
              Common Support Topics
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {supportTopics.map((topic, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-blue-900 p-6 text-white shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">Need quick help?</h2>
            <p className="mb-6 text-blue-100">
              For faster support, keep your loan ID or registered mobile number ready
              when contacting customer care.
            </p>

            <div className="space-y-3 text-blue-100">
              <p>
                <span className="font-semibold text-white">Best for:</span> Application status, document issues, and loan queries
              </p>
              <p>
                <span className="font-semibold text-white">Keep ready:</span> Loan ID, mobile number, and registered email
              </p>
              <p>
                <span className="font-semibold text-white">Response:</span> Faster during working hours
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/user/my-applications"
                className="rounded-xl bg-white px-5 py-2.5 font-semibold text-blue-900 transition hover:bg-blue-50"
              >
                View My Applications
              </Link>

              <Link
                to="/user"
                className="rounded-xl border border-white px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
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