import React from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";
import {
  PhoneCall,
  Mail,
  Clock3,
  Landmark,
  MessageSquareText,
} from "lucide-react";

const supportTopics = [
  {
    title: "Help with loan application",
    description: "Get guidance for filling, reviewing, and submitting your loan application.",
    action: "Call Support",
    href: "tel:+919876543210",
  },
  {
    title: "Document upload support",
    description: "Get help if your files are not uploading or are showing an error.",
    action: "Email Support",
    href: "mailto:support@mybank.com?subject=Document%20Upload%20Support",
  },
  {
    title: "Application status clarification",
    description: "Understand your current loan stage and what happens next.",
    action: "Call Support",
    href: "tel:+919876543210",
  },
  {
    title: "KYC update assistance",
    description: "Get help updating PAN, Aadhaar, or address-related details.",
    action: "Email Support",
    href: "mailto:support@mybank.com?subject=KYC%20Update%20Assistance",
  },
  {
    title: "General banking support",
    description: "Reach out for general account, service, or customer support questions.",
    action: "Call Support",
    href: "tel:+919876543210",
  },
  {
    title: "Customer account guidance",
    description: "Get support for profile details, account access, and customer settings.",
    action: "Email Support",
    href: "mailto:support@mybank.com?subject=Customer%20Account%20Guidance",
  },
];

const contactCards = [
  {
    title: "Call Us",
    description: "Speak directly with our customer support team.",
    value: "+91 98765 43210",
    helper: "Best for urgent application help",
    icon: PhoneCall,
  },
  {
    title: "Email Support",
    description: "Send your queries and we will respond as soon as possible.",
    value: "support@mybank.com",
    helper: "Best for document-related queries",
    icon: Mail,
  },
  {
    title: "Working Hours",
    description: "Our team is available during these hours.",
    value: "Mon - Sat",
    subValue: "9:00 AM - 6:00 PM",
    helper: "Faster response during support hours",
    icon: Clock3,
  },
  {
    title: "Visit Us",
    description: "You can visit our office for direct support and guidance.",
    value: "In-person Support",
    helper: "Best for in-person assistance",
    icon: Landmark,
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
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-sm">
            <MessageSquareText className="h-7 w-7" strokeWidth={2.2} />
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
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                  <card.icon className="h-7 w-7" strokeWidth={2.2} />
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
      Here are the most common areas our support team can help you with.
    </p>
  </div>

  <div className="grid gap-4 sm:grid-cols-2">
    {supportTopics.map((topic, index) => (
      <div
        key={index}
        className="rounded-[24px] border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          {topic.title}
        </h3>

        <p className="mt-2 text-sm leading-7 text-gray-600">
          {topic.description}
        </p>

        <a
          href={topic.href}
          className="mt-4 inline-flex rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          {topic.action}
        </a>
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
      Need help with your loan application, document upload, or status updates?
      Keep your loan ID and registered mobile number ready for faster support.
    </p>
  </div>

  <div className="grid gap-4">
    <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
      <p className="text-sm leading-7 text-blue-100">
        <span className="font-semibold text-white">Best for:</span>{" "}
        Loan application help, document issues, and status questions
      </p>
    </div>

    <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
      <p className="text-sm leading-7 text-blue-100">
        <span className="font-semibold text-white">Keep ready:</span>{" "}
        Loan ID, registered mobile number, and email
      </p>
    </div>

    <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur-sm">
      <p className="text-sm leading-7 text-blue-100">
        <span className="font-semibold text-white">Support hours:</span>{" "}
        Faster replies during working hours
      </p>
    </div>
  </div>

  <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
    <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">
      Contact Options
    </p>

    <div className="mt-3 space-y-2 text-sm text-blue-100">
      <p>
        <span className="font-semibold text-white">Phone:</span> +91 98765 43210
      </p>
      <p>
        <span className="font-semibold text-white">Email:</span> support@mybank.com
      </p>
      <p>
        <span className="font-semibold text-white">Availability:</span> Mon - Sat, 9:00 AM - 6:00 PM
      </p>
    </div>
  </div>

  <div className="mt-8 flex flex-wrap gap-4">
    <a
      href="tel:+919876543210"
      className="rounded-2xl bg-white px-5 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
    >
      Call Support
    </a>

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