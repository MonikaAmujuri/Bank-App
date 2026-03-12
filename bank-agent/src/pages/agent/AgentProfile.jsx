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
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Email - Read Only */}
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">Email</label>
        <input
          type="text"
          value={user?.email || ""}
          disabled
          className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Role - Read Only */}
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">Role</label>
        <input
          type="text"
          value={user?.role?.toUpperCase() || ""}
          disabled
          className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-sm text-gray-500 mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Password Notice */}
      <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg mb-6 text-sm">
        Password cannot be changed here. Please contact admin.
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default AgentProfile;