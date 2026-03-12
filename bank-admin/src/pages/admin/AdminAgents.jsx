import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminAgents = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [generatedPassword, setGeneratedPassword] = useState("");

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [location, setLocation] = useState("");
const [pincode, setPincode] = useState("");

  const fetchAgents = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/agents",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setAgents(data);
    } catch (error) {
      console.error("Fetch agents error:", error);
    }
  };
  const handleRegisterAgent = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      "http://localhost:5000/api/admin/create-agent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, location, pincode }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed");
    }

    setGeneratedPassword(data.password);
    setShowModal(false);
    setShowSuccess(true);

    setName("");
    setEmail("");

    fetchAgents(); // refresh list
  } catch (error) {
    alert(error.message);
  }
};

  const deactivateAgent = async (id) => {
  await fetch(
    `http://localhost:5000/api/admin/deactivate/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  fetchAgents();
}; // refresh list

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this agent?");
  if (!confirmDelete) return;

  try {
    await fetch(`http://localhost:5000/api/admin/agents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchAgents(); // refresh list
  } catch (error) {
    console.error("Delete failed:", error);
  }
};


  useEffect(() => {
    if (token) fetchAgents();
  }, [token]);

  const activateAgent = async (id) => {
  try {
    await fetch(
      `http://localhost:5000/api/admin/activate/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchAgents();
  } catch (error) {
    console.error("Activate error:", error);
  }
};

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          Agents
        </h1>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          <span className="text-lg leading-none">+</span>
          Register Agent
        </button>
      </div>
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Agent ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Location</th>
              <th className="p-4">Pincode</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent._id}
                onClick={() => navigate(`/admin/agents/${agent._id}`)}
                className="border-t cursor-pointer hover:bg-gray-50 transition"
              >
                <td className="p-4">{agent.agentId}</td>
                <td className="p-4">{agent.name}</td>
                <td className="p-4">{agent.email}</td>
                <td className="p-4">{agent.phone}</td>
                <td className="p-4">{agent.location}</td>
                <td className="p-4">{agent.pincode}</td>
                <td className="p-4">
                  {agent.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )}
                </td>
                <td className="p-4">
                  {agent.isActive ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deactivateAgent(agent._id);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Deactivate
                    </button>
                  ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          activateAgent(agent._id);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                      >
                        Activate
                      </button> 
                  )}
                </td>
                <td className="p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(agent._id);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {agents.length === 0 && (
          <p className="p-6 text-gray-500 text-center">
            No agents found
          </p>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Register Agent</h2>

            <form onSubmit={handleRegisterAgent}>
              <input
                type="text"
                placeholder="Name"
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Phone"
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Location"
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Pincode"
                className="w-full mb-4 px-4 py-2 border rounded-lg"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              Agent Created Successfully
            </h2>

            <p className="mb-2">Generated Password:</p>

            <div className="bg-gray-100 p-3 rounded-lg mb-4 font-mono">
              {generatedPassword}
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(generatedPassword)}
              className="mb-4 text-blue-600 underline"
            >
              Copy Password
            </button>

            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
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
