import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";
import {
  UserRound,
  ReceiptText,
  IdCard,
  FolderOpen,
  Zap,
  FileText,
  FolderKanban,
  MessageSquareText,
} from "lucide-react";

const SectionCard = ({ badge, title, subtitle, icon, children }) => (
  <section className="overflow-hidden rounded-[30px] border border-gray-100 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.07)]">
    <div className="border-b border-indigo-50 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-6 py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 shadow-sm">
            {badge}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-[30px]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-gray-600 md:text-base">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-blue-100 bg-white/80 text-blue-600 shadow-sm">
        {icon}
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-b from-white to-slate-50/70 p-6">
      {children}
    </div>
  </section>
);

const DetailItem = ({ label, value, tone = "default" }) => {
  const toneClasses = {
    default: "border-gray-200 bg-white",
    blue: "border-blue-100 bg-gradient-to-br from-white to-blue-50",
    emerald: "border-emerald-100 bg-gradient-to-br from-white to-emerald-50",
    amber: "border-amber-100 bg-gradient-to-br from-white to-amber-50",
    violet: "border-violet-100 bg-gradient-to-br from-white to-violet-50",
  };

  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${toneClasses[tone]}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>
      <p className="mt-3 break-words text-lg font-bold text-gray-900">
        {value || "N/A"}
      </p>
    </div>
  );
};

const StatusRow = ({ label, uploaded }) => (
  <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
    <div>
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="mt-1 text-sm text-gray-500">
        {uploaded
          ? "Document available in your profile"
          : "Document is not uploaded yet"}
      </p>
    </div>

    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        uploaded
          ? "border border-green-200 bg-green-100 text-green-700"
          : "border border-red-200 bg-red-100 text-red-700"
      }`}
    >
      {uploaded ? "Uploaded" : "Missing"}
    </span>
  </div>
);

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/me", {
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
          throw new Error(data.message || "Failed to fetch profile");
        }

        setProfile(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const panUploaded = !!profile?.documents?.panCard?.url;
  const aadharUploaded = !!profile?.documents?.aadharCard?.url;
  const totalUploaded = [panUploaded, aadharUploaded].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-8 py-10 shadow-[0_18px_50px_rgba(59,130,246,0.10)] ring-1 ring-blue-100 md:px-10">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                Customer Profile
              </p>

              <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
                My Profile
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600">
                View your account details, KYC information, and document readiness
                from one secure profile space.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm">
                  <p className="text-sm text-gray-500">Customer ID</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.userId || profile?._id || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm">
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm">
                  <p className="text-sm text-gray-500">Documents Ready</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {totalUploaded}/2 Uploaded
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_50px_rgba(59,130,246,0.12)] backdrop-blur">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-sm">
                    <UserRound className="h-7 w-7" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                      Account Identity
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-gray-900">
                      {profile?.name || "Customer"}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {profile?.email || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Mobile
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                      {profile?.mobile || profile?.phone || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </p>
                    <p className="mt-1 text-base font-semibold capitalize text-gray-900">
                      {profile?.role || "user"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/user/profile/edit"
                  className="mt-6 inline-flex rounded-2xl bg-blue-900 px-5 py-3 font-medium text-white transition hover:bg-blue-800"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <div className="rounded-[28px] bg-white p-6 text-gray-600 shadow-sm ring-1 ring-gray-100">
            Loading profile...
          </div>
        )}

        {error && (
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && profile && (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard
                badge="Account Overview"
                title="Account Information"
                subtitle="Your main banking account details."
                icon={<ReceiptText className="h-7 w-7" strokeWidth={2.2} />}
              >
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem label="Full Name" value={profile.name || "N/A"} tone="blue" />
                  <DetailItem label="Email" value={profile.email || "N/A"} tone="default" />
                  <DetailItem
                    label="Mobile Number"
                    value={profile.mobile || profile.phone || "N/A"}
                    tone="emerald"
                  />
                  <DetailItem
                    label="Customer ID"
                    value={profile.userId || profile._id || "N/A"}
                    tone="violet"
                  />
                  <DetailItem
                    label="Role"
                    value={profile.role || "user"}
                    tone="amber"
                  />
                  <DetailItem
                    label="Joined On"
                    value={
                      profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString()
                        : "N/A"
                    }
                    tone="default"
                  />
                </div>
              </SectionCard>

              <SectionCard
                badge="Identity Check"
                title="Personal & KYC Details"
                subtitle="Personal identity details used for verification."
                icon={<IdCard className="h-7 w-7" strokeWidth={2.2} />}
              >
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem
                    label="PAN Number"
                    value={profile.panNumber || "N/A"}
                    tone="violet"
                  />
                  <DetailItem
                    label="Aadhaar Number"
                    value={profile.aadharNumber || "N/A"}
                    tone="blue"
                  />
                  <DetailItem
                    label="Address"
                    value={profile.address || "N/A"}
                    tone="default"
                  />
                </div>
              </SectionCard>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard
                badge="Readiness"
                title="Document Status"
                subtitle="Track whether your KYC documents are available in your profile."
                icon={<FolderOpen className="h-7 w-7" strokeWidth={2.2} />}
              >
                <div className="space-y-4">
                  <StatusRow label="PAN Card" uploaded={panUploaded} />
                  <StatusRow label="Aadhaar Card" uploaded={aadharUploaded} />

                  <div className="rounded-[24px] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                      Profile Readiness
                    </p>
                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      {totalUploaded === 2
                        ? "Your profile documents are available and ready for smoother loan processing."
                        : "Some profile documents are still missing. Upload them to keep your account ready."}
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                badge="Shortcuts"
                title="Quick Actions"
                subtitle="Fast access to your most-used customer pages."
                icon={<Zap className="h-7 w-7" strokeWidth={2.2} />}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    to="/user/my-applications"
                    className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                      <FileText className="h-6 w-6" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      My Applications
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Review all submitted loan applications and their latest status.
                    </p>
                  </Link>

                  <Link
                    to="/user/documents"
                    className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-white to-cyan-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                      <FolderKanban className="h-6 w-6" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Uploaded Documents
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      View and manage your PAN and Aadhaar documents from one place.
                    </p>
                  </Link>

                  <Link
                    to="/user/support"
                    className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-white to-indigo-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:col-span-2"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                      <MessageSquareText className="h-6 w-6" strokeWidth={2.2} />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Need Help?
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Contact customer support for help with documents, applications,
                      and account-related queries.
                    </p>
                  </Link>
                </div>
              </SectionCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;