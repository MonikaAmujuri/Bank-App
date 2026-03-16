import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch users error:", error);
    }
  };

  const deactivateUser = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/deactivate/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (error) {
      console.error("Deactivate error:", error);
    }
  };

  const activateUser = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/activate/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (error) {
      console.error("Activate error:", error);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const activeUsers = users.filter((user) => !user.isDeleted && user.isActive).length;
  const inactiveUsers = users.filter((user) => user.isDeleted || !user.isActive).length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Admin Customers
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">Customer Management</h1>
            <p className="mt-3 max-w-2xl text-indigo-100">
              View registered users, monitor account status, and manage access
              from one place.
            </p>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Customers</p>
          <h3 className="mt-2 text-4xl font-bold text-indigo-600">{users.length}</h3>
          <p className="mt-2 text-sm text-gray-400">All registered customer accounts</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Customers</p>
          <h3 className="mt-2 text-4xl font-bold text-green-600">{activeUsers}</h3>
          <p className="mt-2 text-sm text-gray-400">Currently active customer accounts</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Inactive Customers</p>
          <h3 className="mt-2 text-4xl font-bold text-red-500">{inactiveUsers}</h3>
          <p className="mt-2 text-sm text-gray-400">Blocked or removed customer accounts</p>
        </div>
      </section>

      {/* Table card */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Customer Records</h2>
          <p className="mt-1 text-gray-500">
            Manage user access and review account details.
          </p>
        </div>

        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-4 font-medium">User ID</th>
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">Email</th>
                  <th className="pb-4 font-medium">Loan Type</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isUserInactive = user.isDeleted || !user.isActive;

                  return (
                    <tr
                      key={user._id}
                      className="border-b border-gray-50 transition hover:bg-gray-50 last:border-b-0"
                    >
                      <td className="py-4 font-semibold text-gray-900">{user.userId}</td>

                      <td className="py-4">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>

                      <td className="py-4 text-gray-700">{user.email}</td>

                      <td className="py-4 text-gray-700">{user.loanType || "-"}</td>

                      <td className="py-4">
                        {isUserInactive ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Inactive
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-4">
                        {user.isDeleted ? (
                          <span className="text-sm font-medium text-gray-500">
                            Removed by Agent
                          </span>
                        ) : user.isActive ? (
                          <button
                            onClick={() => deactivateUser(user._id)}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => activateUser(user._id)}
                            className="rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                          >
                            Unblock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
            No users found.
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUsers;