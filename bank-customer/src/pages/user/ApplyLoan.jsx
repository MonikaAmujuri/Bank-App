import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const SectionCard = ({ badge, title, subtitle, icon, children }) => (
  <section className="overflow-hidden rounded-[30px] border border-gray-100 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.07)]">
    <div className="border-b border-indigo-50 bg-gradient-to-r from-slate-50 via-white to-sky-50 px-6 py-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 shadow-sm">
            {badge}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-[30px]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-600 md:text-base">{subtitle}</p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-blue-100 bg-white/80 text-2xl shadow-sm">
          {icon}
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-b from-white to-slate-50/70 p-6">
      {children}
    </div>
  </section>
);

const UploadCard = ({
  label,
  name,
  multiple = false,
  helperText = "",
  error,
  onChange,
  inputClass,
  errorClass,
}) => (
  <div className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
    <label className="mb-3 block text-sm font-semibold text-gray-800">
      {label}
    </label>

    <input
      type="file"
      name={name}
      multiple={multiple}
      onChange={onChange}
      className={inputClass}
      required
    />

    {helperText ? (
      <p className="mt-3 text-xs text-gray-500">{helperText}</p>
    ) : null}

    {error ? <p className={errorClass}>{error}</p> : null}
  </div>
);

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
  const [currentStep, setCurrentStep] = useState(1);

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

  const validateStep = (step) => {
    const newErrors = {};

    const mobileRegex = /^[6-9]\d{9}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const aadhaarRegex = /^\d{12}$/;

    if (step === 1) {
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
    }

    if (step === 2) {
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
    }

    if (step === 3) {
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
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  
  const getFieldClass = (fieldName) =>
  `${inputClass} ${
    errors[fieldName]
      ? "border-red-300 focus:border-red-400 focus:ring-red-50"
      : ""
  }`;

  const errorClass = "mt-2 text-xs font-medium text-red-500";
  const getStepCardClasses = (step) => {
    if (currentStep === step) {
      return "rounded-2xl bg-blue-900 px-4 py-4 text-center shadow-lg shadow-blue-100 ring-1 ring-blue-900";
    }
    if (currentStep > step) {
      return "rounded-2xl bg-emerald-50 px-4 py-4 text-center shadow-sm ring-1 ring-emerald-200";
    }
    return "rounded-2xl bg-white px-4 py-4 text-center shadow-sm ring-1 ring-gray-100";
  };

  const getStepTitleClasses = (step) => {
    if (currentStep === step) return "text-lg font-bold text-white";
    if (currentStep > step) return "text-lg font-bold text-emerald-700";
    return "text-lg font-bold text-blue-900";
  };

  const getStepTextClasses = (step) => {
    if (currentStep === step) return "mt-1 text-xs text-blue-100";
    if (currentStep > step) return "mt-1 text-xs text-emerald-700";
    return "mt-1 text-xs text-gray-500";
  };

  
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-8 py-10 shadow-[0_18px_50px_rgba(59,130,246,0.10)] ring-1 ring-blue-100 md:px-10">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm">
                Loan Application
              </p>
              <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
                Apply for a Loan
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600">
                Move through each step smoothly and submit your application with all required details and documents.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm">
                  <p className="text-sm text-gray-500">Current Step</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {currentStep === 1
                      ? "Personal Details"
                      : currentStep === 2
                      ? "Loan Details"
                      : currentStep === 3
                      ? "Document Uploads"
                      : "Review & Submit"}
                  </p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-white/85 px-4 py-3 shadow-sm">
                  <p className="text-sm text-gray-500">Estimated Time</p>
                  <p className="mt-1 font-semibold text-gray-900">3–5 minutes</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:w-[420px]">
              <div className={getStepCardClasses(1)}>
                <p className={getStepTitleClasses(1)}>Step 1</p>
                <p className={getStepTextClasses(1)}>Personal Info</p>
              </div>
              <div className={getStepCardClasses(2)}>
                <p className={getStepTitleClasses(2)}>Step 2</p>
                <p className={getStepTextClasses(2)}>Loan Details</p>
              </div>
              <div className={getStepCardClasses(3)}>
                <p className={getStepTitleClasses(3)}>Step 3</p>
                <p className={getStepTextClasses(3)}>Documents</p>
              </div>
              <div className={getStepCardClasses(4)}>
                <p className={getStepTitleClasses(4)}>Step 4</p>
                <p className={getStepTextClasses(4)}>Submit</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl">
          {submitError && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <SectionCard
                badge="Step 1"
                title="Personal Details"
                subtitle="Confirm your identity and contact information before moving forward."
                icon="👤"
              >
                <div className="mb-6 rounded-[24px] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                    Verified Profile Information
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    These details are prefilled from your account. Review them before proceeding to the next step.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name {errors.fullName && <span className="text-red-500">*</span>}
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Mobile Number {errors.mobile && <span className="text-red-500">* </span>}
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
                     {errors.mobile && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {errors.mobile}
                        </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email ID {errors.email && <span className="text-red-500">*</span>}
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      PAN Card Number {errors.panNumber && <span className="text-red-500">*</span>}
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Aadhaar Card Number {errors.aadhaarNumber && <span className="text-red-500">*</span>}
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
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Address {errors.address && <span className="text-red-500">*</span>}
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
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="rounded-2xl bg-blue-900 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-800"
                  >
                    Next Step
                  </button>
                </div>
              </SectionCard>
            )}

            {currentStep === 2 && (
              <SectionCard
                badge="Step 2"
                title="Loan Details"
                subtitle="Enter the type of loan and your employment details."
                icon="💼"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Type of Loan {errors.loanType && <span className="text-red-500">*</span>}
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Loan Amount {errors.loanAmount && <span className="text-red-500">*</span>}
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Company Name {errors.companyName && <span className="text-red-500">*</span>}
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Location {errors.location && <span className="text-red-500">*</span>}
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Salary {errors.salary && <span className="text-red-500">*</span>}
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Net Hand Salary {errors.netHandSalary && <span className="text-red-500">*</span>}
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
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="rounded-2xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="rounded-2xl bg-blue-900 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-800"
                  >
                    Next Step
                  </button>
                </div>
              </SectionCard>
            )}

            {currentStep === 3 && (
              <SectionCard
                badge="Step 3"
                title="Document Uploads"
                subtitle="Upload the required documents for verification and review."
                icon="📄"
              >
                <div className="mb-6 rounded-[24px] border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-yellow-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
                    Upload Checklist
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Make sure all required files are clear, readable, and ready before moving forward.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <UploadCard
                  label="Upload PAN Card"
                  name="panFile"
                  error={errors.panFile}
                  onChange={handleFileChange}
                  inputClass={inputClass}
                  errorClass={errorClass}
                  />

                  <UploadCard
                    label="Upload Aadhaar Card"
                    name="aadhaarFile"
                    error={errors.aadhaarFile}
                    onChange={handleFileChange}
                    inputClass={inputClass}
                    errorClass={errorClass}
                  />

                  <UploadCard
                    label="Upload Bank Statements"
                    name="bankStatements"
                    multiple
                    helperText="Upload single PDF or multiple files"
                    error={errors.bankStatements}
                    onChange={handleFileChange}
                    inputClass={inputClass}
                    errorClass={errorClass}
                  />

                  <UploadCard
                    label="Upload IT Returns (3 Years)"
                    name="itReturns"
                    multiple
                    helperText="Upload all 3 years documents"
                    error={errors.itReturns}
                    onChange={handleFileChange}
                    inputClass={inputClass}
                    errorClass={errorClass}
                  />

                  <div className="md:col-span-2">
                    <UploadCard
                      label="Upload Payslips (Last 3 Months)"
                      name="payslips"
                      multiple
                      helperText="Upload payslips for the last 3 months"
                      error={errors.payslips}
                      onChange={handleFileChange}
                      inputClass={inputClass}
                      errorClass={errorClass}
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="rounded-2xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="rounded-2xl bg-blue-900 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-800"
                  >
                    Review & Continue
                  </button>
                </div>
              </SectionCard>
            )}

            {currentStep === 4 && (
              <section className="space-y-8">
                <SectionCard
                  badge="Step 4"
                  title="Review & Submit"
                  subtitle="Review your filled details before final submission."
                  icon="✅"
                >
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
                        Personal Summary
                      </p>

                      <div className="mt-4 space-y-3 text-sm text-gray-700">
                        <p><span className="font-semibold text-gray-900">Full Name:</span> {formData.fullName || "—"}</p>
                        <p><span className="font-semibold text-gray-900">Mobile:</span> {formData.mobile || "—"}</p>
                        <p><span className="font-semibold text-gray-900">Email:</span> {formData.email || "—"}</p>
                        <p><span className="font-semibold text-gray-900">PAN:</span> {formData.panNumber || "—"}</p>
                        <p><span className="font-semibold text-gray-900">Aadhaar:</span> {formData.aadhaarNumber || "—"}</p>
                        <p><span className="font-semibold text-gray-900">Address:</span> {formData.address || "—"}</p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Loan Summary
                      </p>

                      <div className="mt-4 space-y-3 text-sm text-gray-700">
                        <p><span className="font-semibold text-gray-900">Loan Type:</span> {formData.loanType || "—"}</p>
                        <p><span className="font-semibold text-gray-900">Loan Amount:</span> {formData.loanAmount || "—"}</p>
                        <p><span className="font-semibold text-gray-900">Company Name:</span> {formData.companyName || "—"}</p>
                        <p><span className="font-semibold text-gray-900">Location:</span> {formData.location || "—"}</p>
                        <p><span className="font-semibold text-gray-900">Salary:</span> {formData.salary || "—"}</p>
                        <p><span className="font-semibold text-gray-900">Net Hand Salary:</span> {formData.netHandSalary || "—"}</p>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <section className="rounded-[30px] border border-blue-100 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white shadow-[0_18px_45px_rgba(30,64,175,0.22)]">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100">
                        Final Step
                      </p>
                      <h3 className="mt-2 text-2xl font-bold">
                        Ready to submit your application?
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-blue-100">
                        Review your information carefully before submitting. Once submitted,
                        your application will move forward for verification and processing.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-2xl bg-white px-6 py-3.5 font-semibold text-blue-900 shadow-lg transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting
                          ? "Submitting Application..."
                          : "Submit Loan Application"}
                      </button>
                    </div>
                  </div>
                </section>
              </section>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;