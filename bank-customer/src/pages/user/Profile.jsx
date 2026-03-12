import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Customer Profile
          </p>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 text-gray-600">
            View your account details, KYC information, and document status.
          </p>
        </div>
        <div className="mb-6">
          <Link
            to="/user/profile/edit"
            className="rounded-xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800"
          >
            Edit Profile
          </Link>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">Loading profile...</div>
        )}

        {error && (
          <div className="rounded-2xl bg-red-50 p-6 text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && profile && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-blue-900">
                Account Information
              </h2>

              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold">Full Name:</span> {profile.name || "N/A"}</p>
                <p><span className="font-semibold">Email:</span> {profile.email || "N/A"}</p>
                <p><span className="font-semibold">Mobile Number:</span> {profile.mobile || profile.phone || "N/A"}</p>
                <p><span className="font-semibold">Customer ID:</span> {profile.userId || profile._id || "N/A"}</p>
                <p><span className="font-semibold">Role:</span> <span className="capitalize">{profile.role || "user"}</span></p>
                <p>
                  <span className="font-semibold">Joined On:</span>{" "}
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-blue-900">
                Personal & KYC Details
              </h2>

              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold">PAN Number:</span> {profile.panNumber || "N/A"}</p>
                <p><span className="font-semibold">Aadhaar Number:</span> {profile.aadharNumber || "N/A"}</p>
                <p><span className="font-semibold">Address:</span> {profile.address || "N/A"}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-blue-900">
                Document Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4">
                  <span className="font-medium text-gray-700">PAN Card</span>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${panUploaded ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {panUploaded ? "Uploaded" : "Not Uploaded"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4">
                  <span className="font-medium text-gray-700">Aadhaar Card</span>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${aadharUploaded ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {aadharUploaded ? "Uploaded" : "Not Uploaded"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-semibold text-blue-900">
                Quick Actions
              </h2>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/user/my-applications"
                  className="rounded-xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800"
                >
                  My Applications
                </Link>

                <Link
                  to="/user/documents"
                  className="rounded-xl border border-blue-900 px-5 py-2.5 font-medium text-blue-900 transition hover:bg-blue-50"
                >
                  Uploaded Documents
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;