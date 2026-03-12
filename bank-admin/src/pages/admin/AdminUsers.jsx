import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { data } from "react-router-dom";

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Fetch users error:", error);
    }
  };

  const deactivateUser = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/admin/deactivate/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers(); // refresh list
    } catch (error) {
      console.error("Deactivate error:", error);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const activateUser = async (id) => {
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

    fetchUsers();
  } catch (error) {
    console.error("Activate error:", error);
  }
};

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Users</h1>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">User ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Loan Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isUserInactive = user.isDeleted || !user.isActive;

              return (
                <tr key={user._id} className="border-t">
                  <td className="p-4">{user.userId}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.loanType}</td>

                  <td className="p-4">
                    {isUserInactive ? (
                      <span className="text-red-500">Inactive</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </td>

                  <td className="p-4">
                    {user.isDeleted ? (
                      <span className="text-gray-500">Removed by Agent</span>
                    ) : user.isActive ? (
                      <button
                        onClick={() => deactivateUser(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => activateUser(user._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
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
    </div>
  );
};

export default AdminUsers;
