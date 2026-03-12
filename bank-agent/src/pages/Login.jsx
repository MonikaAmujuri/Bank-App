import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleContinue}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Use email with password or phone number with OTP
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {message && (
          <p className="text-green-600 text-sm mb-4 text-center">{message}</p>
        )}

        <input
          type="text"
          placeholder="Email or phone number"
          className="w-full mb-4 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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

        {isEmail(identifier) && (
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}

        {!confirmationResult && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
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
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mb-4 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              type="button"
              onClick={handleOtpVerifyClick}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        <div id="recaptcha-container"></div>
      </form>
    </div>
  );
};

export default Login;