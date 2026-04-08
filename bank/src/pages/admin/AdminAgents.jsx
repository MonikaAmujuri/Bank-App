import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";
import { CheckCircle2, Ban, Trash2 } from "lucide-react";

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
    <div className="space-y-5 sm:space-y-6 lg:space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-5 text-white shadow-lg sm:rounded-3xl sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-100 sm:text-sm sm:tracking-widest">
              Admin Agents
            </p>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-indigo-100 sm:text-base">
              Manage loan agents, review their status, and register new agents
              for platform operations.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto">
            {statusFilter && (
              <button
                onClick={() => navigate("/admin/agents")}
                className="w-full rounded-xl border border-white/40 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto sm:px-5"
              >
                Clear Filter
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 sm:w-auto sm:px-5"
            >
              + Register Agent
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Agent Summary
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
              <p className="text-sm font-medium text-gray-500">Total Agents</p>
              <h3 className="mt-2 text-3xl font-bold text-indigo-600 sm:text-4xl">
                {agents.length}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                All registered agent accounts
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
              <p className="text-sm font-medium text-gray-500">Active Agents</p>
              <h3 className="mt-2 text-3xl font-bold text-green-600 sm:text-4xl">
                {activeAgents}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Currently active agent accounts
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
              <p className="text-sm font-medium text-gray-500">Inactive Agents</p>
              <h3 className="mt-2 text-3xl font-bold text-red-500 sm:text-4xl">
                {inactiveAgents}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Deactivated agent accounts
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Agent Status Distribution
              </h3>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Percentage breakdown of active and inactive agents.
              </p>
            </div>

            {agentChartData.length > 0 ? (
              <div className="grid gap-6 lg:gap-8 xl:grid-cols-2 xl:items-center">
                <div className="h-[260px] w-full sm:h-[320px] md:h-[360px]">
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

                <div className="space-y-3 sm:space-y-4">
                  {agentChartData.map((item, index) => {
                    const percent = totalAgentChartValue
                      ? ((item.value / totalAgentChartValue) * 100).toFixed(1)
                      : 0;

                    return (
                      <div
                        key={item.name}
                        onClick={() => handleAgentPieClick(item)}
                        className="flex cursor-pointer items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 transition hover:bg-gray-100 sm:px-5 sm:py-4"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-4 w-4 rounded-full"
                            style={{
                              backgroundColor:
                                agentChartColors[index % agentChartColors.length],
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
                No agent data available.
              </div>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="mb-5 sm:mb-6">
          <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Agent Records
          </h2>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Click any row to open full agent details.
          </p>
        </div>

        {agents.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
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
                            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                          >
                            <Ban className="h-4 w-4" strokeWidth={2.2} />
                            <span>Deactivate</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              activateAgent(agent._id);
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                          >
                            <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
                            <span>Activate</span>
                          </button>
                        )}
                      </td>

                      <td className="py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(agent._id);
                          }}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  onClick={() => navigate(`/admin/agents/${agent._id}`)}
                  className="cursor-pointer rounded-2xl border border-gray-100 bg-gray-50/70 p-4 shadow-sm transition hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-4">
                    <div
                      className="flex items-start justify-between gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {agent.name}
                          </h3>

                          {agent.isActive ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-medium text-red-700">
                              Inactive
                            </span>
                          )}
                        </div>

                        <p className="mt-1 break-all text-sm text-gray-600">
                          {agent.email}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {agent.isActive ? (
                          <button
                            onClick={() => deactivateAgent(agent._id)}
                            title="Deactivate"
                            aria-label="Deactivate"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white transition hover:bg-red-600"
                          >
                            <Ban className="h-4 w-4" strokeWidth={2.2} />
                          </button>
                        ) : (
                          <button
                            onClick={() => activateAgent(agent._id)}
                            title="Activate"
                            aria-label="Activate"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white transition hover:bg-green-600"
                          >
                            <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(agent._id)}
                          title="Delete"
                          aria-label="Delete"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Agent ID
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {agent.agentId}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Phone
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {agent.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Location
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {agent.location}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Pincode
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {agent.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-500 sm:text-base">
            No agents found.
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
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
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 sm:text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Phone"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 sm:text-base"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Location"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 sm:text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Pincode"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 sm:text-base"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 text-center shadow-2xl sm:rounded-3xl sm:p-6">
            <h2 className="text-xl font-semibold text-green-600 sm:text-2xl">
              Agent Created Successfully
            </h2>

            <p className="mt-4 text-sm text-gray-500">Generated Password</p>

            <div className="mt-3 break-all rounded-2xl bg-gray-100 p-4 font-mono text-sm text-gray-900 sm:text-base">
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
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 sm:text-base"
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