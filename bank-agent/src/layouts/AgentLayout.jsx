import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AgentLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
  logout();
  navigate("/");
};

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <NavLink
          to="/agent/dashboard"
          className="p-6 text-xl font-bold border-b block hover:bg-gray-100 transition"
        >
          Agent Panel
        </NavLink>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/agent/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/agent/users"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Customers
          </NavLink>
          <NavLink
            to="/agent/loans"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Loans
          </NavLink>
          <NavLink
            to="/agent/profile"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Profile
          </NavLink>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;