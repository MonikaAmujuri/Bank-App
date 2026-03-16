import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const ApplyLoan = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    panNumber: "",
    aadhaarNumber: "",
    address: "",
    loanType: "",
    loanAmount: "",
    companyName: "",
    location: "",
    salary: "",
    netHandSalary: "",
    panFile: null,
    aadhaarFile: null,
    bankStatements: [],
    itReturns: [],
    payslips: [],
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`Request failed with status ${res.status}`);
        }

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setFormData((prev) => ({
          ...prev,
          fullName: data.name || "",
          mobile: data.mobile || data.phone || "",
          email: data.email || "",
          panNumber: data.panNumber || "",
          aadhaarNumber: data.aadharNumber || data.aadhaarNumber || "",
          address: data.address || "",
        }));
      } catch (error) {
        console.error("Profile prefill error:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const { name, files, multiple } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: multiple ? Array.from(files) : files[0],
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const mobileRegex = /^[6-9]\d{9}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const aadhaarRegex = /^\d{12}$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.panNumber.trim()) {
      newErrors.panNumber = "PAN number is required";
    } else if (!panRegex.test(formData.panNumber.trim().toUpperCase())) {
      newErrors.panNumber = "Enter a valid PAN number";
    }

    if (!formData.aadhaarNumber.trim()) {
      newErrors.aadhaarNumber = "Aadhaar number is required";
    } else if (!aadhaarRegex.test(formData.aadhaarNumber.trim())) {
      newErrors.aadhaarNumber = "Enter a valid 12-digit Aadhaar number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.loanType) {
      newErrors.loanType = "Loan type is required";
    }

    if (!formData.loanAmount) {
      newErrors.loanAmount = "Loan amount is required";
    } else if (Number(formData.loanAmount) <= 0) {
      newErrors.loanAmount = "Loan amount must be greater than 0";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    } else if (Number(formData.salary) <= 0) {
      newErrors.salary = "Salary must be greater than 0";
    }

    if (!formData.netHandSalary) {
      newErrors.netHandSalary = "Net hand salary is required";
    } else if (Number(formData.netHandSalary) <= 0) {
      newErrors.netHandSalary = "Net hand salary must be greater than 0";
    }

    if (!formData.panFile) {
      newErrors.panFile = "PAN card file is required";
    }

    if (!formData.aadhaarFile) {
      newErrors.aadhaarFile = "Aadhaar card file is required";
    }

    if (!formData.bankStatements.length) {
      newErrors.bankStatements = "Bank statement is required";
    }

    if (!formData.itReturns.length) {
      newErrors.itReturns = "IT returns are required";
    }

    if (!formData.payslips.length) {
      newErrors.payslips = "Payslips are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("mobile", formData.mobile);
      data.append("email", formData.email);
      data.append("panNumber", formData.panNumber.toUpperCase());
      data.append("aadhaarNumber", formData.aadhaarNumber);
      data.append("address", formData.address);
      data.append("loanType", formData.loanType);
      data.append("loanAmount", formData.loanAmount);
      data.append("companyName", formData.companyName);
      data.append("location", formData.location);
      data.append("salary", formData.salary);
      data.append("netHandSalary", formData.netHandSalary);

      if (formData.panFile) {
        data.append("panFile", formData.panFile);
      }

      if (formData.aadhaarFile) {
        data.append("aadhaarFile", formData.aadhaarFile);
      }

      formData.bankStatements.forEach((file) => {
        data.append("bankStatements", file);
      });

      formData.itReturns.forEach((file) => {
        data.append("itReturns", file);
      });

      formData.payslips.forEach((file) => {
        data.append("payslips", file);
      });

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/loans/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to submit application");
      }

      navigate("/user/loan-success", {
        state: {
          loanType: formData.loanType,
          loanAmount: formData.loanAmount,
          referenceId: result?.loan?._id || result?.loan?.loanId || "",
        },
      });
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-[32px] bg-white p-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <p className="text-lg font-medium text-gray-700">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

  const errorClass = "mt-2 text-sm font-medium text-red-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-8 py-10 shadow-sm ring-1 ring-blue-100 md:px-10">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                Loan Application
              </p>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Apply for a Loan
              </h1>
              <p className="mt-3 text-gray-600 leading-7">
                Fill in your details and upload the required documents to
                continue your loan application securely and smoothly.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:w-[420px]">
              <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                <p className="text-lg font-bold text-blue-900">Step 1</p>
                <p className="mt-1 text-xs text-gray-500">Personal info</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                <p className="text-lg font-bold text-blue-900">Step 2</p>
                <p className="mt-1 text-xs text-gray-500">Loan details</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                <p className="text-lg font-bold text-blue-900">Step 3</p>
                <p className="mt-1 text-xs text-gray-500">Documents</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                <p className="text-lg font-bold text-blue-900">Step 4</p>
                <p className="mt-1 text-xs text-gray-500">Submit</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
          {submitError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details */}
            <div className="rounded-[28px] border border-gray-200 bg-gray-50/60 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-blue-900">
                  Personal Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Confirm your identity and contact information.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={inputClass}
                    required
                  />
                  {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className={inputClass}
                    required
                  />
                  {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email ID"
                    className={inputClass}
                    required
                  />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    PAN Card Number
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="Enter PAN card number"
                    className={`${inputClass} uppercase`}
                    required
                  />
                  {errors.panNumber && <p className={errorClass}>{errors.panNumber}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Aadhaar Card Number
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="Enter Aadhaar card number"
                    className={inputClass}
                    required
                  />
                  {errors.aadhaarNumber && (
                    <p className={errorClass}>{errors.aadhaarNumber}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    rows="4"
                    className={inputClass}
                    required
                  />
                  {errors.address && <p className={errorClass}>{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="rounded-[28px] border border-gray-200 bg-gray-50/60 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-blue-900">
                  Loan Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the type of loan and employment details.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Type of Loan
                  </label>
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select loan type</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Education Loan">Education Loan</option>
                    <option value="Vehicle Loan">Vehicle Loan</option>
                    <option value="Business Loan">Business Loan</option>
                  </select>
                  {errors.loanType && <p className={errorClass}>{errors.loanType}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Loan Amount
                  </label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    placeholder="Enter loan amount"
                    className={inputClass}
                    required
                  />
                  {errors.loanAmount && <p className={errorClass}>{errors.loanAmount}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className={inputClass}
                    required
                  />
                  {errors.companyName && (
                    <p className={errorClass}>{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className={inputClass}
                    required
                  />
                  {errors.location && <p className={errorClass}>{errors.location}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter salary"
                    className={inputClass}
                    required
                  />
                  {errors.salary && <p className={errorClass}>{errors.salary}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Net Hand Salary
                  </label>
                  <input
                    type="number"
                    name="netHandSalary"
                    value={formData.netHandSalary}
                    onChange={handleChange}
                    placeholder="Enter net hand salary"
                    className={inputClass}
                    required
                  />
                  {errors.netHandSalary && (
                    <p className={errorClass}>{errors.netHandSalary}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="rounded-[28px] border border-gray-200 bg-gray-50/60 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-blue-900">
                  Document Uploads
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload the required documents for verification.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload PAN Card
                  </label>
                  <input
                    type="file"
                    name="panFile"
                    onChange={handleFileChange}
                    className={inputClass}
                    required
                  />
                  {errors.panFile && <p className={errorClass}>{errors.panFile}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload Aadhaar Card
                  </label>
                  <input
                    type="file"
                    name="aadhaarFile"
                    onChange={handleFileChange}
                    className={inputClass}
                    required
                  />
                  {errors.aadhaarFile && (
                    <p className={errorClass}>{errors.aadhaarFile}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload Bank Statements
                  </label>
                  <input
                    type="file"
                    name="bankStatements"
                    multiple
                    onChange={handleFileChange}
                    className={inputClass}
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Upload single PDF or multiple files
                  </p>
                  {errors.bankStatements && (
                    <p className={errorClass}>{errors.bankStatements}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload IT Returns (3 Years)
                  </label>
                  <input
                    type="file"
                    name="itReturns"
                    multiple
                    onChange={handleFileChange}
                    className={inputClass}
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Upload all 3 years documents
                  </p>
                  {errors.itReturns && <p className={errorClass}>{errors.itReturns}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Upload Payslips (Last 3 Months)
                  </label>
                  <input
                    type="file"
                    name="payslips"
                    multiple
                    onChange={handleFileChange}
                    className={inputClass}
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Upload payslips for the last 3 months
                  </p>
                  {errors.payslips && <p className={errorClass}>{errors.payslips}</p>}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-900 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting Application..." : "Submit Loan Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;