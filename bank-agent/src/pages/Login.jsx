import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);
  const isPhone = (value) => /^(\+\d{10,15}|\d{10})$/.test(value);

  const normalizedPhone =
    /^\d{10}$/.test(identifier) ? `+91${identifier}` : identifier;

  const redirectByRole = (user) => {
    if (user.role === "agent") {
      navigate("/agent/dashboard");
    } else {
      navigate("/");
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  };

  const handleEmailLogin = async () => {
    if (!password) {
      setError("Please enter password");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: identifier.toLowerCase().trim(),
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    login(data.user, data.token);
    redirectByRole(data.user);
  };

  const handleSendOtp = async () => {
    setupRecaptcha();

    const result = await signInWithPhoneNumber(
      auth,
      normalizedPhone,
      window.recaptchaVerifier
    );

    setConfirmationResult(result);
    setMessage("OTP sent successfully");
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    const result = await confirmationResult.confirm(otp);
    const firebaseUser = result.user;
    const idToken = await firebaseUser.getIdToken();

    const res = await fetch("http://localhost:5000/api/auth/firebase-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    login(data.user, data.token);
    redirectByRole(data.user);
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isEmail(identifier)) {
        await handleEmailLogin();
      } else if (isPhone(identifier)) {
        await handleSendOtp();
      } else {
        setError("Enter a valid email or phone number");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerifyClick = async () => {
    setError("");
    setLoading(true);

    try {
      await handleVerifyOtp();
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:grid-cols-2">
        {/* Left Panel */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-10 text-white md:flex">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold shadow-md backdrop-blur-sm">
                M
              </div>
              <div>
                <h1 className="text-2xl font-bold">MyBank Agent</h1>
                <p className="text-sm text-indigo-100">Loan Operations</p>
              </div>
            </div>

            <div className="mt-12">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-100">
                Welcome Back
              </p>
              <h2 className="text-4xl font-bold leading-tight">
                Sign in to manage your assigned customers and loans
              </h2>
              <p className="mt-4 max-w-md text-indigo-100">
                Access your loan pipeline, review pending applications, and
                manage customer activity from one premium workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm font-medium text-indigo-100">
                Secure Access
              </p>
              <p className="mt-1 text-sm text-white/90">
                Login with email and password or phone number with OTP.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm font-medium text-indigo-100">
                Agent Workspace
              </p>
              <p className="mt-1 text-sm text-white/90">
                Track assigned loans, review applications, and manage customers
                efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-10 md:p-12">
          <div className="mb-8 text-center md:text-left">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-2xl font-bold text-white shadow-md md:hidden">
              M
            </div>

            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-indigo-600">
              Agent Login
            </p>
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-500">
              Use email with password or phone number with OTP
            </p>
          </div>

          <form onSubmit={handleContinue} className="space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Email or Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter email or phone number"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setPassword("");
                  setOtp("");
                  setConfirmationResult(null);
                  setError("");
                  setMessage("");
                }}
                required
              />
            </div>

            {isEmail(identifier) && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {!confirmationResult && (
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 py-3.5 font-medium text-white transition hover:opacity-95 disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : isEmail(identifier)
                  ? "Login"
                  : isPhone(identifier)
                  ? "Send OTP"
                  : "Continue"}
              </button>
            )}

            {confirmationResult && (
              <div className="space-y-4 rounded-3xl border border-gray-100 bg-gray-50 p-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-green-500"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOtpVerifyClick}
                  disabled={loading}
                  className="w-full rounded-2xl bg-green-600 py-3.5 font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            <div id="recaptcha-container"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;