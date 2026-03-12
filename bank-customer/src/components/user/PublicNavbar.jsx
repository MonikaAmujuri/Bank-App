import React, { useState } from "react";
import { Link } from "react-router-dom";

const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold tracking-tight text-blue-900">
          MyBank
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="font-medium text-gray-700 transition hover:text-blue-700">
            Home
          </Link>

          <div className="relative group">
            <button className="font-medium text-gray-700 transition hover:text-blue-700">
              Loans
            </button>

            <div className="absolute left-0 top-full mt-3 hidden w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl group-hover:block">
              <Link
                to="/loans/personal"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              >
                Personal Loan
              </Link>
              <Link
                to="/loans/home"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              >
                Home Loan
              </Link>
              <Link
                to="/loans/education"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              >
                Education Loan
              </Link>
              <Link
                to="/loans/vehicle"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              >
                Vehicle Loan
              </Link>
              <Link
                to="/loans/business"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              >
                Business Loan
              </Link>
            </div>
          </div>

          <Link
            to="/login"
            className="rounded-xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800"
          >
            Login
          </Link>
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/login"
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white"
          >
            Login
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-gray-300 p-2 text-gray-700"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="font-medium text-gray-700 hover:text-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <div>
              <button
                onClick={() => setLoanOpen(!loanOpen)}
                className="flex w-full items-center justify-between font-medium text-gray-700 hover:text-blue-700"
              >
                Loans
                <span>{loanOpen ? "−" : "+"}</span>
              </button>

              {loanOpen && (
                <div className="mt-3 ml-3 flex flex-col rounded-lg border border-gray-200 bg-gray-50">
                  <Link
                    to="/loans/personal"
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Personal Loan
                  </Link>
                  <Link
                    to="/loans/home"
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home Loan
                  </Link>
                  <Link
                    to="/loans/education"
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Education Loan
                  </Link>
                  <Link
                    to="/loans/vehicle"
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Vehicle Loan
                  </Link>
                  <Link
                    to="/loans/business"
                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Business Loan
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;