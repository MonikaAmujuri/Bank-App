import React from "react";
import { useState, useEffect } from "react";
import { BriefcaseBusiness } from "lucide-react";

const EmploymentDetails = ({ data, isEditable, onSave }) => {
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [netHandSalary, setNetHandSalary] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setCompany(data.companyName || "");
      setJobTitle(data.jobTitle || "");
      setLocation(data.location || "");
      setSalary(data.salary || "");
      setNetHandSalary(data.netHandSalary || "");
    }
  }, [data]);

  const handleSaveClick = () => {
    const newErrors = {};

    const trimmedCompany = String(company).trim();
    const trimmedJobTitle = String(jobTitle).trim();
    const trimmedLocation = String(location).trim();
    const trimmedSalary = String(salary).trim();
    const trimmedNetHandSalary = String(netHandSalary).trim();

    const validateTextField = (value) =>
      /^[A-Za-z0-9\s&.,'()\/-]+$/.test(String(value).trim());

    const validateNumbersOnly = (value) =>
      /^\d+(\.\d+)?$/.test(String(value).trim());

    if (!trimmedCompany) {
      newErrors.company = "Company name is required";
    } else if (!validateTextField(trimmedCompany)) {
      newErrors.company = "Enter a valid company name";
    }

    if (!trimmedJobTitle) {
      newErrors.jobTitle = "Job title is required";
    } else if (!validateTextField(trimmedJobTitle)) {
      newErrors.jobTitle = "Enter a valid job title";
    }

    if (!trimmedLocation) {
      newErrors.location = "Location is required";
    } else if (!validateTextField(trimmedLocation)) {
      newErrors.location = "Enter a valid location";
    }

    if (!trimmedSalary) {
      newErrors.salary = "Salary is required";
    } else if (!validateNumbersOnly(trimmedSalary)) {
      newErrors.salary = "Enter only numbers";
    } else if (Number(trimmedSalary) <= 0) {
      newErrors.salary = "Salary must be greater than 0";
    }

    if (!trimmedNetHandSalary) {
      newErrors.netHandSalary = "Net hand salary is required";
    } else if (!validateNumbersOnly(trimmedNetHandSalary)) {
      newErrors.netHandSalary = "Enter only numbers";
    } else if (Number(trimmedNetHandSalary) <= 0) {
      newErrors.netHandSalary = "Net hand salary must be greater than 0";
    } else if (Number(trimmedNetHandSalary) > Number(trimmedSalary)) {
      newErrors.netHandSalary = "Net hand salary cannot be greater than salary";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave("employmentDetails", {
      companyName: trimmedCompany,
      jobTitle: trimmedJobTitle,
      salary: trimmedSalary,
      location: trimmedLocation,
      netHandSalary: trimmedNetHandSalary,
    });
  };

  const validateNumbersOnly = (value) =>
    /^\d+(\.\d+)?$/.test(String(value).trim());

  const getFieldClass = (fieldName) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm sm:text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
      errors[fieldName] ? "border-red-300" : "border-gray-300"
    }`;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Employment Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and update the applicant’s work and income information.
            </p>
          </div>

          <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-2xl sm:rounded-3xl border border-blue-100 bg-white/80 text-blue-600 shadow-sm shrink-0">
            <BriefcaseBusiness className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.2} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Company Name
            </label>

            {isEditable ? (
              <>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCompany(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        company: "Company name is required",
                      }));
                    } else if (!/^[A-Za-z0-9\s&.,'()\/-]+$/.test(value.trim())) {
                      setErrors((prev) => ({
                        ...prev,
                        company: "Enter a valid company name",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, company: "" }));
                    }
                  }}
                  className={getFieldClass("company")}
                  placeholder="Enter company name"
                  required
                />
                {errors.company && (
                  <p className="mt-2 text-sm text-red-500">{errors.company}</p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {company || "N/A"}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Job Title
            </label>

            {isEditable ? (
              <>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => {
                    const value = e.target.value;
                    setJobTitle(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        jobTitle: "Job title is required",
                      }));
                    } else if (!/^[A-Za-z0-9\s&.,'()\/-]+$/.test(value.trim())) {
                      setErrors((prev) => ({
                        ...prev,
                        jobTitle: "Enter a valid job title",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, jobTitle: "" }));
                    }
                  }}
                  className={getFieldClass("jobTitle")}
                  placeholder="Enter job title"
                  required
                />
                {errors.jobTitle && (
                  <p className="mt-2 text-sm text-red-500">{errors.jobTitle}</p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {jobTitle || "N/A"}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Location
            </label>

            {isEditable ? (
              <>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocation(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        location: "Location is required",
                      }));
                    } else if (!/^[A-Za-z0-9\s&.,'()\/-]+$/.test(value.trim())) {
                      setErrors((prev) => ({
                        ...prev,
                        location: "Enter a valid location",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, location: "" }));
                    }
                  }}
                  className={getFieldClass("location")}
                  placeholder="Enter work location"
                  required
                />
                {errors.location && (
                  <p className="mt-2 text-sm text-red-500">{errors.location}</p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {location || "N/A"}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Salary
            </label>

            {isEditable ? (
              <>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSalary(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        salary: "Salary is required",
                      }));
                    } else if (!validateNumbersOnly(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        salary: "Enter only numbers",
                      }));
                    } else if (Number(value) <= 0) {
                      setErrors((prev) => ({
                        ...prev,
                        salary: "Salary must be greater than 0",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, salary: "" }));
                    }
                  }}
                  className={getFieldClass("salary")}
                  placeholder="Enter monthly salary"
                  required
                />
                {errors.salary && (
                  <p className="mt-2 text-sm text-red-500">{errors.salary}</p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                ₹ {salary || 0}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5 md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Net Hand Salary
            </label>

            {isEditable ? (
              <>
                <input
                  type="text"
                  value={netHandSalary}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNetHandSalary(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        netHandSalary: "Net hand salary is required",
                      }));
                    } else if (!validateNumbersOnly(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        netHandSalary: "Enter only numbers",
                      }));
                    } else if (Number(value) <= 0) {
                      setErrors((prev) => ({
                        ...prev,
                        netHandSalary: "Net hand salary must be greater than 0",
                      }));
                    } else if (
                      salary &&
                      validateNumbersOnly(salary) &&
                      Number(value) > Number(salary)
                    ) {
                      setErrors((prev) => ({
                        ...prev,
                        netHandSalary:
                          "Net hand salary cannot be greater than salary",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, netHandSalary: "" }));
                    }
                  }}
                  className={getFieldClass("netHandSalary")}
                  placeholder="Enter monthly net hand salary"
                  required
                />
                {errors.netHandSalary && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.netHandSalary}
                  </p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                ₹ {netHandSalary || 0}
              </p>
            )}
          </div>
        </div>

        {isEditable && (
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-start">
            <button
              onClick={handleSaveClick}
              className="w-full sm:w-auto rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
            >
              Save Employment Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmploymentDetails;