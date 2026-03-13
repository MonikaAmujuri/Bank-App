import React, { useState } from "react";
import { useEffect } from "react";
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
    <div className="min-h-screen bg-gray-50 ">  
      <UserNavbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-center rounded-3xl bg-white p-10 shadow-lg">  
          <p className="text-lg font-medium text-gray-700">Loading profile...</p>
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-50 ">
      <UserNavbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-lg md:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Loan Application
          </p>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Apply for a Loan
          </h1>
          <p className="mt-3 text-gray-600">
            Fill in your details and upload the required documents to continue
            your loan application.
          </p>
        </div>

        {submitError && (
  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
    {submitError}
  </div>
)}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Details */}
          <div className="rounded-3xl border border-gray-200 p-6">
            <h2 className="mb-6 text-2xl font-semibold text-blue-900">
              Personal Details
            </h2>

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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="rounded-3xl border border-gray-200 p-6">
            <h2 className="mb-6 text-2xl font-semibold text-blue-900">
              Loan Details
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Type of Loan
                </label>
                <select
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">Select loan type</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Education Loan">Education Loan</option>
                  <option value="Vehicle Loan">Vehicle Loan</option>
                  <option value="Business Loan">Business Loan</option>
                </select>
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />            
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="rounded-3xl border border-gray-200 p-6">
            <h2 className="mb-6 text-2xl font-semibold text-blue-900">
              Document Uploads
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Upload PAN Card
                </label>
                <input
                  type="file"
                  name="panFile"
                  onChange={handleFileChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Upload Aadhaar Card
                </label>
                <input
                  type="file"
                  name="aadhaarFile"
                  onChange={handleFileChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />
                
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />

                <p className="mt-1 text-xs text-gray-500">
                  Upload single PDF or multiple files
                </p>
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />
                
                <p className="mt-1 text-xs text-gray-500">
                  Upload all 3 years documents
                </p>
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  required
                />
                
                <p className="mt-1 text-xs text-gray-500">
                  Upload payslips for the last 3 months
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
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