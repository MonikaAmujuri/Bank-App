import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {
  const { token } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleSave = async () => {
    await fetch("http://localhost:5000/api/admin/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    setAdmin({ ...admin, ...formData });
    setEditing(false);
  };

  const handlePasswordChange = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Password updated successfully");
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setAdmin(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (!admin) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Admin Profile
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">Profile Settings</h1>
            <p className="mt-3 max-w-2xl text-indigo-100">
              Manage your account details, update profile information, and change
              your password securely.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {editing ? (
              <button
                onClick={handleSave}
                className="rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
              >
                Edit Profile
              </button>
            )}

            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="rounded-xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              {showPasswordForm ? "Hide Password Form" : "Change Password"}
            </button>
          </div>
        </div>
      </section>

      {/* Profile cards */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Account Information
            </h2>
            <p className="mt-1 text-gray-500">
              View and manage your admin profile details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">Name</p>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              ) : (
                <div className="rounded-2xl bg-gray-50 px-4 py-3 font-medium text-gray-900">
                  {admin.name}
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">Email</p>
              <div className="rounded-2xl bg-gray-50 px-4 py-3 font-medium text-gray-900">
                {admin.email}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">Role</p>
              <div className="rounded-2xl bg-gray-50 px-4 py-3 font-medium capitalize text-gray-900">
                {admin.role}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">Status</p>
              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                {admin.isActive ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Quick Info</h2>
          <p className="mt-1 text-gray-500">
            Your current account summary.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-indigo-50 px-4 py-4">
              <p className="text-sm text-indigo-500">Account Type</p>
              <h3 className="mt-1 text-lg font-semibold text-indigo-700">
                Administrator
              </h3>
            </div>

            <div className="rounded-2xl bg-blue-50 px-4 py-4">
              <p className="text-sm text-blue-500">Email Access</p>
              <h3 className="mt-1 text-lg font-semibold text-blue-700">
                {admin.email}
              </h3>
            </div>

            <div className="rounded-2xl bg-green-50 px-4 py-4">
              <p className="text-sm text-green-500">Current Status</p>
              <h3 className="mt-1 text-lg font-semibold text-green-700">
                {admin.isActive ? "Active" : "Inactive"}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Password form */}
      {showPasswordForm && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Change Password
            </h2>
            <p className="mt-1 text-gray-500">
              Update your password to keep your account secure.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:max-w-xl">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
            />

            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
            />

            <div>
              <button
                onClick={handlePasswordChange}
                className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700"
              >
                Update Password
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminProfile;