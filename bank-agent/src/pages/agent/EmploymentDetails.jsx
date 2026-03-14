import React from "react";
import { useState, useEffect } from "react";

const EmploymentDetails = ({ data, isEditable, onSave }) => {
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [netHandSalary, setNetHandSalary] = useState("");

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
    onSave("employmentDetails", {
      companyName: company,
      jobTitle,
      salary,
      location,
      netHandSalary,
    });
  };

  return (
  <div className="space-y-8">
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Employment Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and update the applicant’s work and income information.
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
          💼
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Company Name
          </label>

          {isEditable ? (
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter company name"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {company || "-"}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Job Title
          </label>

          {isEditable ? (
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter job title"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {jobTitle || "-"}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Location
          </label>

          {isEditable ? (
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter work location"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {location || "-"}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Salary
          </label>

          {isEditable ? (
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter salary"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              ₹ {salary || 0}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-5 md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Net Hand Salary
          </label>

          {isEditable ? (
            <input
              type="number"
              value={netHandSalary}
              onChange={(e) => setNetHandSalary(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter net hand salary"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              ₹ {netHandSalary || 0}
            </p>
          )}
        </div>
      </div>

      {isEditable && (
        <div className="mt-8 flex justify-start">
          <button
            onClick={handleSaveClick}
            className="rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
          >
            Save Employment Details
          </button>
        </div>
      )}
    </div>
  </div>
);
}

export default EmploymentDetails;