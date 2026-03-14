import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const AgentProfile = () => {
  const { user, token } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/agent/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, phone }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      alert("Profile updated successfully");

    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="mx-auto max-w-4xl space-y-8">
    <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
            Agent Account
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">My Profile</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            View and update your profile details used across the agent panel.
          </p>
        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-3xl font-bold text-white backdrop-blur-sm">
          {name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
      </div>
    </section>

    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Agent Name</p>
        <h2 className="mt-3 text-2xl font-bold text-indigo-600">
          {name || user?.name || "-"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">Displayed across the system</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Role</p>
        <h2 className="mt-3 text-2xl font-bold text-blue-600">
          {user?.role?.toUpperCase() || "-"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">Current access level</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Email</p>
        <h2 className="mt-3 break-words text-lg font-bold text-gray-800">
          {user?.email || "-"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">Primary login email</p>
      </div>
    </section>

    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Profile Information
        </h2>
        <p className="mt-1 text-gray-500">
          Update your personal details below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter your name"
          />
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Enter phone number"
          />
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Email
          </label>
          <input
            type="text"
            value={user?.email || ""}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
          />
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Role
          </label>
          <input
            type="text"
            value={user?.role?.toUpperCase() || ""}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-700">
        Password cannot be changed here. Please contact admin.
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  </div>
);
};

export default AgentProfile;