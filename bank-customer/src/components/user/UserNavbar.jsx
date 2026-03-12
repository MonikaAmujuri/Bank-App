import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive(path)
        ? "bg-blue-100 text-blue-900"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/user" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-900 text-lg font-bold text-white shadow-sm">
            M
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-900">
              MyBank
            </h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              Customer Banking
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/user" className={navLinkClass("/user")}>
            Home
          </Link>

          <Link
            to="/user/apply-loan"
            className={navLinkClass("/user/apply-loan")}
          >
            Apply Loan
          </Link>

          <Link
            to="/user/my-applications"
            className={navLinkClass("/user/my-applications")}
          >
            My Applications
          </Link>

          <Link
            to="/user/documents"
            className={navLinkClass("/user/documents")}
          >
            Documents
          </Link>
          <Link
          to="/user/support"
          className={navLinkClass("/user/support")}
          >
            Support
          </Link>
          <Link
          to="/user/profile"
          className={navLinkClass("/user/profile")}
          >
            Profile
          </Link>
        </div>

        {/* Right side */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || "Customer"}
            </p>
            <p className="text-xs text-gray-500">Logged in securely</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Logout
          </button>
        </div>

        {/* Mobile button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-gray-300 p-2 text-gray-700 md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 md:hidden">
          <div className="mb-4 rounded-2xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || "Customer"}
            </p>
            <p className="text-xs text-gray-500">Logged in securely</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/user"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass("/user")}
            >
              Home
            </Link>

            <Link
              to="/user/apply-loan"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass("/user/apply-loan")}
            >
              Apply Loan
            </Link>

            <Link
              to="/user/my-applications"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass("/user/my-applications")}
            >
              My Applications
            </Link>

            <Link
              to="/user/documents"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass("/user/documents")}
            >
              Documents
            </Link>

            <Link
            to="/user/support"
            onClick={() => setMenuOpen(false)}
            className={navLinkClass("/user/support")}
            >
              Support
            </Link>

            <Link
            to="/user/profile"
            onClick={() => setMenuOpen(false)}
            className={navLinkClass("/user/profile")}
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="mt-2 rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;