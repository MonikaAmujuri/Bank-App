import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";


const AgentUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [panNumber, setPanNumber] = useState("");
const [aadharNumber, setAadharNumber] = useState("");
const [address, setAddress] = useState("");
const [generatedPassword, setGeneratedPassword] = useState("");
const [showChart, setShowChart] = useState(false);

useEffect(() => {
  if (!token) return;
  fetchUsers();
}, [token]);

const fetchUsers = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/agent/users?all=true", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (Array.isArray(data)) {
      setUsers(data);
    } else {
      setUsers([]);
    }
  } catch (err) {
    console.error(err);
  }
};

  const generatePassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  setGeneratedPassword(password);
};
const handleCreateUser = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/users/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        panNumber,
        aadharNumber,
        address,
        password: generatedPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("User created successfully");

    setShowForm(false);
    setName("");
    setEmail("");
    setGeneratedPassword("");

    fetchUsers(); // 🔥 refresh list
  } catch (error) {
    console.error(error);
  }
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to remove this user?");

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/users/${id}/delete`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to delete user");
    }

    fetchUsers(); // refresh list

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

const handleRestore = async (id) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/users/${id}/restore`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to restore user");
    }

    fetchUsers(); // refresh list

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

const handleStartLoan = async (userId) => {
  if (!userId) {
    alert("Cannot start loan: missing user ID");
    return;
  }

  try {
    const res = await fetch(
      "http://localhost:5000/api/loans/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message);
    }

    // Redirect to loan page
    navigate(`/agent/loans/${data.loan.loanId}`);

  } catch (error) {
    console.error(error);
    alert("Failed to start loan");
  }
};

const activeUsers = users.filter((user) => !user.isDeleted && user.isActive).length;
const inactiveUsers = users.filter((user) => user.isDeleted || !user.isActive).length;

const activeCustomers = users.filter(
  (user) => !user.isDeleted && user.isActive
).length;

const inactiveCustomers = users.filter(
  (user) => user.isDeleted || !user.isActive
).length;

const customerChartData = [
  { name: "Active Customers", value: activeCustomers },
  { name: "Inactive Customers", value: inactiveCustomers },
].filter((item) => item.value > 0);

const customerChartColors = ["#22C55E", "#EF4444"];

const totalCustomerChartValue = customerChartData.reduce(
  (sum, item) => sum + item.value,
  0
);

const renderPercentLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

  return (
  <div className="space-y-8">
    <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
            Customer Management
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">My Customers</h1>
          <p className="mt-3 max-w-2xl text-indigo-100">
            Manage your assigned customers, review their status, and start loan
            applications from one place.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="rounded-2xl bg-white px-6 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
        >
          + Add Customer
        </button>
      </div>
    </section>

    <section>
  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">
        Customer Summary
      </h2>
      <p className="mt-1 text-gray-500">
        Overview of assigned customer account status.
      </p>
    </div>

    <button
      onClick={() => setShowChart(!showChart)}
      className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
    >
      {showChart ? "Show Cards" : "Show Chart"}
    </button>
  </div>

  {!showChart ? (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Total Customers</p>
        <h3 className="mt-2 text-4xl font-bold text-indigo-600">
          {users.length}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          All registered customer accounts
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Active Customers</p>
        <h3 className="mt-2 text-4xl font-bold text-green-600">
          {activeCustomers}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Customers with active accounts
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Inactive Customers</p>
        <h3 className="mt-2 text-4xl font-bold text-red-500">
          {inactiveCustomers}
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Customers with inactive accounts
        </p>
      </div>
    </div>
  ) : (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          Customer Status Distribution
        </h3>
        <p className="mt-1 text-gray-500">
          Percentage breakdown of active and inactive customers.
        </p>
      </div>

      {customerChartData.length > 0 ? (
        <div className="grid gap-8 xl:grid-cols-2 xl:items-center">
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={renderPercentLabel}
                  labelLine={false}
                >
                  {customerChartData.map((entry, index) => (
                    <Cell
                      key={`customer-cell-${index}`}
                      fill={customerChartColors[index % customerChartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {customerChartData.map((item, index) => {
              const percent = totalCustomerChartValue
                ? ((item.value / totalCustomerChartValue) * 100).toFixed(1)
                : 0;

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl bg-gray-50 px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor:
                          customerChartColors[index % customerChartColors.length],
                      }}
                    />
                    <span className="font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.value}</p>
                    <p className="text-sm text-gray-500">{percent}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
          No customer data available.
        </div>
      )}
    </div>
  )}
</section>

    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Customer Records
          </h2>
          <p className="mt-1 text-gray-500">
            View all assigned customer details and start loan workflows quickly.
          </p>
        </div>
      </div>

      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-4 font-semibold">Customer ID</th>
                <th className="pb-4 font-semibold">Name</th>
                <th className="pb-4 font-semibold">Email</th>
                <th className="pb-4 font-semibold">Created</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isUserInactive = user.isDeleted || !user.isActive;

                return (
                  <tr
                    key={user._id}
                    className="cursor-pointer border-b border-gray-50 transition hover:bg-gray-50"
                    onClick={() => navigate(`/agent/users/${user._id}`)}
                  >
                    <td className="py-5 font-semibold text-gray-900">
                      {user.userId}
                    </td>

                    <td className="py-5">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="mt-1 text-sm text-gray-400">
                          Customer profile
                        </p>
                      </div>
                    </td>

                    <td className="py-5 text-gray-700">{user.email}</td>

                    <td className="py-5 text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-5">
                      {isUserInactive ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                          Inactive
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/agent/users/${user._id}`);
                          }}
                          className="rounded-xl bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200"
                        >
                          View
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartLoan(user.userId);
                          }}
                          disabled={isUserInactive}
                          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                            isUserInactive
                              ? "cursor-not-allowed bg-gray-200 text-gray-500"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          Start Loan
                        </button>

                        {user.isDeleted ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestore(user.userId);
                            }}
                            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user.userId);
                            }}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-14 text-center">
          <h3 className="text-xl font-semibold text-gray-800">
            No customers found
          </h3>
          <p className="mt-2 text-gray-500">
            There are no customer records right now.
          </p>
        </div>
      )}
    </section>

    {showForm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Add Customer
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Customer
            </h2>
            <p className="mt-2 text-gray-500">
              Add a new customer profile and generate initial login credentials.
            </p>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                type="text"
                placeholder="PAN Number"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
              />

              <input
                type="text"
                placeholder="Aadhar Number"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
              />

              <input
                type="text"
                placeholder="Address"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:col-span-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="mb-3 text-sm font-medium text-gray-600">
                Login Password
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Generated Password"
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none"
                  value={generatedPassword}
                  readOnly
                />

                <button
                  type="button"
                  onClick={generatePassword}
                  className="rounded-xl bg-gray-200 px-4 font-medium text-gray-700 transition hover:bg-gray-300"
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
              >
                Create Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
};

export default AgentUsers;
