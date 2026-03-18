import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";

const AdminAgents = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const statusFilter = searchParams.get("status");
const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showChart, setShowChart] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPincode] = useState("");

  const fetchAgents = async () => {
  try {
    const query = new URLSearchParams();

    if (statusFilter) {
      query.append("status", statusFilter);
    }

    const res = await fetch(
      `http://localhost:5000/api/admin/agents${
        query.toString() ? `?${query.toString()}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setAgents(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Fetch agents error:", error);
  }
};

  const handleRegisterAgent = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/admin/create-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, location, pincode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

      setGeneratedPassword(data.password);
      setShowModal(false);
      setShowSuccess(true);

      setName("");
      setEmail("");
      setPhone("");
      setLocation("");
      setPincode("");

      fetchAgents();
    } catch (error) {
      alert(error.message);
    }
  };

  const deactivateAgent = async (id) => {
    await fetch(`http://localhost:5000/api/admin/deactivate/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchAgents();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this agent?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/admin/agents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAgents();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
  if (token) fetchAgents();
}, [token, statusFilter]);

  const activateAgent = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/activate/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchAgents();
    } catch (error) {
      console.error("Activate error:", error);
    }
  };

const pageTitle =
  statusFilter === "active"
    ? "Active Agents"
    : statusFilter === "inactive"
    ? "Inactive Agents"
    : "Agent Management";

const activeAgents = agents.filter((agent) => agent.isActive).length;
const inactiveAgents = agents.filter((agent) => !agent.isActive).length;

const agentChartData = [
  { name: "Active Agents", value: activeAgents },
  { name: "Inactive Agents", value: inactiveAgents },
].filter((item) => item.value > 0);

const agentChartColors = ["#22C55E", "#EF4444"];

const totalAgentChartValue = agentChartData.reduce(
  (sum, item) => sum + item.value,
  0
);

const renderPercentLabel = ({ percent }) =>
  `${(percent * 100).toFixed(0)}%`;

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

const handleAgentPieClick = (data) => {
  if (!data?.name) return;

  if (data.name === "Active Agents") {
    navigate("/admin/agents?status=active");
  } else if (data.name === "Inactive Agents") {
    navigate("/admin/agents?status=inactive");
  }
};

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-100">
              Admin Agents
            </p>
            <h1 className="text-3xl font-bold md:text-4xl">Agent Management</h1>
            <p className="mt-3 max-w-2xl text-indigo-100">
              Manage loan agents, review their status, and register new agents
              for platform operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {statusFilter && (
            <button
            onClick={() => navigate("/admin/agents")}
            className="rounded-xl border border-white/40 px-5 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Clear Filter
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
            >
              + Register Agent
            </button>
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section>
  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Agent Summary</h2>
      <p className="mt-1 text-gray-500">
        Overview of registered and account status distribution.
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
        <p className="text-sm font-medium text-gray-500">Total Agents</p>
        <h3 className="mt-2 text-4xl font-bold text-indigo-600">{agents.length}</h3>
        <p className="mt-2 text-sm text-gray-400">
          All registered agent accounts
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Active Agents</p>
        <h3 className="mt-2 text-4xl font-bold text-green-600">{activeAgents}</h3>
        <p className="mt-2 text-sm text-gray-400">
          Currently active agent accounts
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Inactive Agents</p>
        <h3 className="mt-2 text-4xl font-bold text-red-500">{inactiveAgents}</h3>
        <p className="mt-2 text-sm text-gray-400">
          Deactivated agent accounts
        </p>
      </div>
    </div>
  ) : (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          Agent Status Distribution
        </h3>
        <p className="mt-1 text-gray-500">
          Percentage breakdown of active and inactive agents.
        </p>
      </div>

      {agentChartData.length > 0 ? (
        <div className="grid gap-8 xl:grid-cols-2 xl:items-center">
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeAgentIndex}
                  activeShape={renderActiveShape}
                  data={agentChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  dataKey="value"
                  label={renderPercentLabel}
                  labelLine={false}
                  onClick={handleAgentPieClick}
                  onMouseEnter={(_, index) => setActiveAgentIndex(index)}
                >
                  {agentChartData.map((entry, index) => (
                    <Cell
                      key={`agent-cell-${index}`}
                      fill={agentChartColors[index % agentChartColors.length]}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {agentChartData.map((item, index) => {
              const percent = totalAgentChartValue
                ? ((item.value / totalAgentChartValue) * 100).toFixed(1)
                : 0;

              return (
                <div
                  key={item.name}
                  onClick={() => handleAgentPieClick(item)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl bg-gray-50 px-5 py-4 transition hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{
                        backgroundColor:
                          agentChartColors[index % agentChartColors.length],
                      }}
                    />
                    <span className="font-medium text-gray-700">{item.name}</span>
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
          No agent data available.
        </div>
      )}
    </div>
  )}
</section>

      {/* Table card */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Agent Records</h2>
          <p className="mt-1 text-gray-500">
            Click any row to open full agent details.
          </p>
        </div>

        {agents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-4 font-medium">Agent ID</th>
                  <th className="pb-4 font-medium">Name</th>
                  <th className="pb-4 font-medium">Email</th>
                  <th className="pb-4 font-medium">Phone</th>
                  <th className="pb-4 font-medium">Location</th>
                  <th className="pb-4 font-medium">Pincode</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">Action</th>
                  <th className="pb-4 font-medium">Delete</th>
                </tr>
              </thead>

              <tbody>
                {agents.map((agent) => (
                  <tr
                    key={agent._id}
                    onClick={() => navigate(`/admin/agents/${agent._id}`)}
                    className="cursor-pointer border-b border-gray-50 transition hover:bg-gray-50 last:border-b-0"
                  >
                    <td className="py-4 font-semibold text-gray-900">
                      {agent.agentId}
                    </td>

                    <td className="py-4 font-medium text-gray-900">
                      {agent.name}
                    </td>

                    <td className="py-4 text-gray-700">{agent.email}</td>

                    <td className="py-4 text-gray-700">{agent.phone}</td>

                    <td className="py-4 text-gray-700">{agent.location}</td>

                    <td className="py-4 text-gray-700">{agent.pincode}</td>

                    <td className="py-4">
                      {agent.isActive ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-4">
                      {agent.isActive ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deactivateAgent(agent._id);
                          }}
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            activateAgent(agent._id);
                          }}
                          className="rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                        >
                          Activate
                        </button>
                      )}
                    </td>

                    <td className="py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(agent._id);
                        }}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-gray-500">
            No agents found.
          </div>
        )}
      </section>

      {/* Register Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-gray-900">
                Register Agent
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Add a new agent to the platform.
              </p>
            </div>

            <form onSubmit={handleRegisterAgent} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Phone"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Location"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Pincode"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-semibold text-green-600">
              Agent Created Successfully
            </h2>

            <p className="mt-4 text-sm text-gray-500">Generated Password</p>

            <div className="mt-3 rounded-2xl bg-gray-100 p-4 font-mono text-gray-900">
              {generatedPassword}
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(generatedPassword)}
              className="mt-4 text-sm font-medium text-indigo-600 underline"
            >
              Copy Password
            </button>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgents;