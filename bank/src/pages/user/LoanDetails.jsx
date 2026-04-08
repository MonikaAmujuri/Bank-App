import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import PublicNavbar from "../../components/user/PublicNavbar";
import UserNavbar from "../../components/user/UserNavbar";
import { loanData } from "../../data/loanData";
import {
  CreditCard,
  Sparkles,
  BadgeCheck,
  FolderOpen,
} from "lucide-react";

const InfoCard = ({ badge, title, items, icon, tone = "blue" }) => {
  const toneMap = {
    blue: {
      wrap: "from-blue-50 via-white to-cyan-50 border-blue-100",
      icon: "bg-blue-100 text-blue-700",
      bullet: "bg-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
    emerald: {
      wrap: "from-emerald-50 via-white to-teal-50 border-emerald-100",
      icon: "bg-emerald-100 text-emerald-700",
      bullet: "bg-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
    amber: {
      wrap: "from-amber-50 via-white to-orange-50 border-amber-100",
      icon: "bg-amber-100 text-amber-700",
      bullet: "bg-amber-500",
      badge: "bg-amber-100 text-amber-700",
    },
  };

  const styles = toneMap[tone];

  return (
    <div
      className={`rounded-[30px] border bg-gradient-to-br ${styles.wrap} p-6 shadow-[0_14px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)]`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div
            className={`mb-3 inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${styles.badge}`}
          >
            {badge}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>

        <div
        className={`flex h-14 w-14 items-center justify-center rounded-3xl shadow-sm ${styles.icon}`}
        >
          {icon}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-sm"
          >
            <span
              className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${styles.bullet}`}
            ></span>
            <p className="text-sm leading-7 text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {isUserRoute ? <UserNavbar /> : <PublicNavbar />}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-blue-100 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full border border-blue-100 bg-blue-100/80 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
                Loan Details
              </p>

              <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                {loan.title}
              </h1>

              <p className="mb-5 text-xl font-medium text-blue-900">
                {loan.subtitle}
              </p>

              <p className="max-w-3xl text-lg leading-8 text-gray-600">
                {loan.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
                  <p className="text-sm text-gray-500">Benefits</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {loan.benefits?.length || 0} Highlights
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
                  <p className="text-sm text-gray-500">Eligibility</p>
                  <p className="mt-1 text-lg font-bold text-blue-900">
                    {loan.eligibility?.length || 0} Conditions
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
                  <p className="text-sm text-gray-500">Documents</p>
                  <p className="mt-1 text-lg font-bold text-emerald-700">
                    {loan.documents?.length || 0} Needed
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_50px_rgba(59,130,246,0.12)] backdrop-blur">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-sm">
                    <CreditCard className="h-7 w-7" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                      Loan Overview
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-gray-900">
                      Why choose this loan?
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Best For
                    </p>
                    <p className="mt-1 text-sm font-medium leading-6 text-gray-700">
                      Customers looking for a secure and easy loan process.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Process
                    </p>
                    <p className="mt-1 text-sm font-medium leading-6 text-gray-700">
                      Simple application, document verification, and guided approval flow.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Support
                    </p>
                    <p className="mt-1 text-sm font-medium leading-6 text-gray-700">
                      Customer assistance is available for application and document help.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={isUserRoute ? "/user/apply-loan" : "/login"}
                    className="rounded-2xl bg-blue-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                  >
                    Apply Now
                  </Link>

                  <Link
                    to={isUserRoute ? "/user" : "/loans"}
                    className="rounded-2xl border border-blue-900 px-5 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
                  >
                    {isUserRoute ? "Back to Home" : "Back to Loans"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
              Everything You Should Know
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Loan essentials at a glance
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-gray-600">
              Understand the benefits, eligibility requirements, and document checklist before you begin.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              badge="Advantages"
              title="Benefits"
              items={loan.benefits}
              icon={<Sparkles className="h-7 w-7" strokeWidth={2.2} />}
              tone="blue"
            />

            <InfoCard
              badge="Requirements"
              title="Eligibility"
              items={loan.eligibility}
              icon={<BadgeCheck className="h-7 w-7" strokeWidth={2.2} />}
              tone="emerald"
            />

            <InfoCard
              badge="Checklist"
              title="Required Documents"
              items={loan.documents}
              icon={<FolderOpen className="h-7 w-7" strokeWidth={2.2} />}
              tone="amber"
            />
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[32px] bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-8 py-14 text-center text-white shadow-[0_25px_80px_rgba(30,64,175,0.30)]">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
              Ready to move forward?
            </p>

            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to apply for {loan.title}?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-base leading-8 text-blue-100">
              Continue with a secure and simple banking experience. Review the loan details, prepare your documents, and begin your application when you are ready.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to={isUserRoute ? "/user/apply-loan" : "/login"}
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
              >
                Apply Now
              </Link>

              <Link
                to={isUserRoute ? "/user" : "/loans"}
                className="rounded-2xl border border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10"
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