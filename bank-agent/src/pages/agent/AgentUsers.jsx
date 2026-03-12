import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
const [showDeleted, setShowDeleted] = useState(false);


useEffect(() => {
  if (!token) return;
  fetchUsers();
}, [token, showDeleted]);

const fetchUsers = async () => {
  try {
    const url = `http://localhost:5000/api/agent/users${
      showDeleted ? "?deleted=true" : ""
    }`;

    const res = await fetch(url, {
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

  return (
      <div className="max-w-6xl mx-auto">

  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-semibold">My Users</h1>

    <button
      onClick={() => setShowForm(true)}
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
    >
      + Add Customer
    </button>
  </div>

  <div className="flex gap-3 mb-4">
  <button
    onClick={() => setShowDeleted(false)}
    className={`px-4 py-1 rounded ${
      !showDeleted ? "bg-indigo-600 text-white" : "bg-gray-200"
    }`}
  >
    Active Customers
  </button>

  <button
    onClick={() => setShowDeleted(true)}
    className={`px-4 py-1 rounded ${
      showDeleted ? "bg-indigo-600 text-white" : "bg-gray-200"
    }`}
  >
    Deleted Customers
  </button>
</div>


  {/* Table */}
  <div className="bg-white rounded-2xl shadow-md overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="text-left px-6 py-3">Customer ID</th>
          <th className="text-left px-6 py-3">Name</th>
          <th className="text-left px-6 py-3">Email</th>
          <th className="text-left px-6 py-3">Created</th>
          <th className="text-left px-6 py-3">Status</th>
          <th className="text-left px-6 py-3">Action</th>
        </tr>
      </thead>

      <tbody>
            {users.map((user) => {
  const isUserInactive = user.isDeleted || !user.isActive;

  return (
    <tr key={user._id} 
    className="border-b hover:bg-gray-50"
    onClick={() => navigate(`/agent/users/${user._id}`)}
    >
      <td className="px-6 py-4">{user.userId}</td>
      <td className="px-6 py-4">{user.name}</td>
      <td className="px-6 py-4">{user.email}</td>
      <td className="px-6 py-4">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>

      <td className="py-3">
        {isUserInactive ? (
          <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
            Inactive
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">
            Active
          </span>
        )}
      </td>

      <td>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStartLoan(user.userId);
            }}
            disabled={isUserInactive}
            className={`px-3 py-1 rounded-md ${
              isUserInactive
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
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
              className="px-3 py-1 bg-green-500 text-white rounded-md"
            >
              Restore
            </button>
          ) : (
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(user.userId);
                }}
              className="px-3 py-1 bg-red-500 text-white rounded-md"
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
      {showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

      <h2 className="text-xl font-semibold mb-6">Create New Customer</h2>

      <form onSubmit={handleCreateUser} className="space-y-4">

        <input
          type="text"
          placeholder="Name"
          className="w-full border px-3 py-2 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border px-3 py-2 rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="PAN Number"
          className="w-full border px-3 py-2 rounded-lg"
          value={panNumber}
          onChange={(e) => setPanNumber(e.target.value)}
        />

        <input
          type="text"
          placeholder="Aadhar Number"
          className="w-full border px-3 py-2 rounded-lg"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          className="w-full border px-3 py-2 rounded-lg"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Generated Password"
            className="flex-1 border px-3 py-2 rounded-lg bg-gray-100"
            value={generatedPassword}
            readOnly
          />

          <button
            type="button"
            onClick={generatePassword}
            className="bg-gray-200 px-3 rounded-lg"
          >
            Generate
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create
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
