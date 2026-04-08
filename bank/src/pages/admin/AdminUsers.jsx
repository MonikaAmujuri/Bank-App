import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";

const AdminUsers = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status");
  const [users, setUsers] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [activeCustomerIndex, setActiveCustomerIndex] = useState(0);

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams();

      if (statusFilter) {
        query.append("status", statusFilter);
      }

      const res = await fetch(
        `http://localhost:5000/api/admin/users${
          query.toString() ? `?${query.toString()}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  }, [token, statusFilter]);

  const activeUsers = users.filter((user) => !user.isDeleted && user.isActive).length;
  const inactiveUsers = users.filter((user) => user.isDeleted || !user.isActive).length;

  const customerChartData = [
    { name: "Active Customers", value: activeUsers },
    { name: "Inactive Customers", value: inactiveUsers },
  ].filter((item) => item.value > 0);

  const customerChartColors = ["#22C55E", "#EF4444"];

  const totalCustomersValue = customerChartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const renderPercentLabel = ({ percent }) =>
    `${(percent * 100).toFixed(0)}%`;

  const handleCustomerPieClick = (data) => {
    if (!data?.name) return;

    if (data.name === "Active Customers") {
      navigate("/admin/users?status=active");
    } else if (data.name === "Inactive Customers") {
      navigate("/admin/users?status=inactive");
    }
  };

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 13}
          outerRadius={outerRadius + 19}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.18}
        />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="#111827"
          className="text-sm font-semibold"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          fill="#6B7280"
          className="text-xs"
        >
          {value} ({(percent * 100).toFixed(1)}%)
        </text>
      </g>
    );
  };

  const pageTitle =
    statusFilter === "active"
      ? "Active Customers"
      : statusFilter === "inactive"
      ? "Inactive Customers"
      : "Customer Management";

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-5 text-white shadow-lg sm:rounded-3xl sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-100 sm:text-sm sm:tracking-widest">
              Admin Customers
            </p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-indigo-100 sm:text-base">
              View registered users, monitor account status, and manage access
              from one place.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {statusFilter && (
              <button
                onClick={() => navigate("/admin/users")}
                className="w-full rounded-xl border border-white/40 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto sm:px-5"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Customer Summary
            </h2>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Overview of registered and account status distribution.
            </p>
          </div>

          <button
            onClick={() => setShowChart(!showChart)}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 sm:w-auto"
          >
            {showChart ? "Show Cards" : "Show Chart"}
          </button>
        </div>

        {!showChart ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <h3 className="mt-2 text-3xl font-bold text-indigo-600 sm:text-4xl">
                {users.length}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                All registered customer accounts
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <h3 className="mt-2 text-3xl font-bold text-green-600 sm:text-4xl">
                {activeUsers}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Currently active customer accounts
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
              <p className="text-sm font-medium text-gray-500">Inactive Customers</p>
              <h3 className="mt-2 text-3xl font-bold text-red-500 sm:text-4xl">
                {inactiveUsers}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Blocked or removed customer accounts
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Customer Status Distribution
              </h3>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Percentage breakdown of active and inactive customers.
              </p>
            </div>

            {customerChartData.length > 0 ? (
              <div className="grid gap-6 lg:gap-8 xl:grid-cols-2 xl:items-center">
                <div className="h-[260px] w-full sm:h-[320px] md:h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeCustomerIndex}
                        activeShape={renderActiveShape}
                        data={customerChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        dataKey="value"
                        label={renderPercentLabel}
                        labelLine={false}
                        onMouseEnter={(_, index) => setActiveCustomerIndex(index)}
                        onClick={handleCustomerPieClick}
                      >
                        {customerChartData.map((entry, index) => (
                          <Cell
                            key={`customer-cell-${index}`}
                            fill={customerChartColors[index % customerChartColors.length]}
                            style={{ cursor: "pointer" }}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {customerChartData.map((item, index) => {
                    const percent = totalCustomersValue
                      ? ((item.value / totalCustomersValue) * 100).toFixed(1)
                      : 0;

                    return (
                      <div
                        key={item.name}
                        onClick={() => handleCustomerPieClick(item)}
                        className="flex cursor-pointer items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 transition hover:bg-gray-100 sm:px-5 sm:py-4"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-4 w-4 rounded-full"
                            style={{
                              backgroundColor:
                                customerChartColors[index % customerChartColors.length],
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700 sm:text-base">
                            {item.name}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{item.value}</p>
                          <p className="text-xs text-gray-500 sm:text-sm">{percent}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-500 sm:text-base">
                No customer data available.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-5 sm:mb-6">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Customer Records
          </h2>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Manage user access and review account details.
          </p>
        </div>

        {users.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
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

            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {users.map((user) => {
                const isUserInactive = user.isDeleted || !user.isActive;

                return (
                  <div
                    key={user._id}
                    className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {user.name}
                          </h3>

                          {isUserInactive ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-medium text-red-700">
                              Inactive
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700">
                              Active
                            </span>
                          )}
                        </div>

                        <p className="mt-1 break-all text-sm text-gray-600">
                          {user.email}
                        </p>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              User ID
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-800">
                              {user.userId}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Loan Type
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-800">
                              {user.loanType || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto">
                        {user.isDeleted ? (
                          <span className="inline-block text-sm font-medium text-gray-500">
                            Removed by Agent
                          </span>
                        ) : user.isActive ? (
                          <button
                            onClick={() => deactivateUser(user._id)}
                            className="w-full rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 sm:w-auto"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => activateUser(user._id)}
                            className="w-full rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-600 sm:w-auto"
                          >
                            Unblock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-500 sm:text-base">
            No users found.
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUsers;