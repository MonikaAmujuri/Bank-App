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

    setAdmin({ ...admin, ...formData }); // update UI instantly
    setEditing(false);
  };
  const handlePasswordChange = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/admin/change-password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Password updated successfully");
    setShowPasswordForm(false);
    setPasswordData({ oldPassword: "", newPassword: "" });

  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  if (!admin) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">
        Admin Profile
      </h1>

      <div className="bg-white p-6 rounded-xl shadow w-full max-w-xl">

        <div className="mb-4">
          <p className="text-gray-500 text-sm">Name</p>

          {editing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border rounded px-3 py-2 w-full"
            />
          ) : (
            <p className="font-semibold">{admin.name}</p>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-500 text-sm">Email</p>
          <p className="font-semibold">{admin.email}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 text-sm">Role</p>
          <p className="font-semibold capitalize">{admin.role}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 text-sm">Status</p>
          <p className="font-semibold">
            {admin.isActive ? "Active" : "Inactive"}
          </p>
        </div>

        {editing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg mt-4"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
          >
            Edit Profile
          </button>
        )}

              <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 ml-3"
              >
                  Change Password
              </button>

              {showPasswordForm && (
                  <div className="mt-4 space-y-3">
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
                          className="border rounded px-3 py-2 w-full"
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
                          className="border rounded px-3 py-2 w-full"
                      />

                      <button
                          onClick={handlePasswordChange}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                          Update Password
                      </button>
                  </div>
              )}
      </div>
    </div>
  );
};

export default AdminProfile;
