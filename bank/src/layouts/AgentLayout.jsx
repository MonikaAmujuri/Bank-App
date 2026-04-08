import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  UserCircle2,
  LogOut,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AgentLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/agent/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/agent/users", label: "Customers", icon: Users },
    { to: "/agent/loans", label: "Loans", icon: FolderOpen },
    { to: "/agent/profile", label: "Profile", icon: UserCircle2 },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200/80 bg-white/95 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur transition-all duration-300 lg:sticky lg:top-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          collapsed ? "w-24" : "w-[88vw] max-w-72 sm:w-72"
        } lg:translate-x-0`}
      >
        <div className="border-b border-slate-100 px-4 py-4 sm:px-4 sm:py-5">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            } gap-3`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-[0_10px_25px_rgba(37,99,235,0.28)] sm:h-14 sm:w-14">
                <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
              </div>

              {!collapsed && (
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    MyBank Agent
                  </h1>
                  <p className="text-xs text-slate-500 sm:text-sm">Loan Operations</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
              >
                <X className="h-5 w-5" strokeWidth={2.2} />
              </button>

              {!collapsed && (
                <button
                  onClick={() => setCollapsed(true)}
                  className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:flex"
                >
                  <PanelLeftClose className="h-5 w-5" strokeWidth={2.2} />
                </button>
              )}
            </div>
          </div>

          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="mt-4 hidden w-full items-center justify-center rounded-xl bg-slate-100 py-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 lg:flex"
            >
              <PanelLeftOpen className="h-5 w-5" strokeWidth={2.2} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-xs">
              Main Menu
            </p>
          )}

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 sm:px-4 sm:py-3.5 ${
                      collapsed ? "justify-center" : "gap-3"
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-[0_10px_25px_rgba(37,99,235,0.22)]"
                        : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                    }`
                  }
                  title={collapsed ? item.label : ""}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-blue-700"
                        }`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                      </span>

                      {!collapsed && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-100 px-3 py-4 sm:px-4">
          {!collapsed ? (
            <>
              <div className="mb-4 overflow-hidden rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm sm:h-11 sm:w-11">
                    <UserCircle2 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[11px]">
                      Signed in as
                    </p>
                    <h3 className="mt-1 truncate text-sm font-semibold text-slate-900 sm:text-base">
                      {user?.name || "Agent"}
                    </h3>
                    <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
                      {user?.email || "Loan Operations"}
                    </p>
                    <p className="mt-2 inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-semibold text-indigo-700 sm:text-[11px]">
                      Agent Workspace
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-red-600 sm:text-base"
              >
                <LogOut className="h-5 w-5" strokeWidth={2.2} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="hidden flex-col items-center gap-3 lg:flex">
              <button
                onClick={() => navigate("/agent/profile")}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                title="Profile"
              >
                <UserCircle2 className="h-5 w-5" strokeWidth={2.2} />
              </button>

              <button
                onClick={handleLogout}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white transition hover:bg-red-600"
                title="Logout"
              >
                <LogOut className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            >
              <Menu className="h-5 w-5" strokeWidth={2.2} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-semibold text-slate-900">
                MyBank Agent
              </h1>
              <p className="truncate text-xs text-slate-500">
                {user?.name || "Agent"}
              </p>
            </div>

            <button
              onClick={() => navigate("/agent/profile")}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
            >
              <UserCircle2 className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;