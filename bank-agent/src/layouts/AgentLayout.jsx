import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AgentLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/agent/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/agent/users", label: "Customers", icon: "👥" },
    { to: "/agent/loans", label: "Loans", icon: "📁" },
    { to: "/agent/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="flex w-72 flex-col border-r border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-2xl text-white shadow-md">
              M
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">MyBank Agent</h1>
              <p className="text-sm text-gray-500">Loan Operations</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto px-4 pb-4">
          <div className="mb-4 rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Signed in as
            </p>
            <h3 className="mt-2 text-base font-semibold text-gray-900">
              {user?.name || "Agent"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {user?.email || "Loan Operations"}
            </p>
            <p className="mt-1 text-xs text-indigo-600">
              Agent Workspace
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600"
          >
            <span>↩</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;