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
  <div className="space-y-6">

    {/* Company */}
    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Company Name
      </label>

      {isEditable ? (
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <p className="text-lg font-medium text-gray-800">
          {company || "-"}
        </p>
      )}
    </div>

    {/* Job Title */}
    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Job Title
      </label>

      {isEditable ? (
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <p className="text-lg font-medium text-gray-800">
          {jobTitle || "-"}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Location
      </label>

      {isEditable ? (
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <p className="text-lg font-medium text-gray-800">
          {location || "-"}
        </p>
      )}
    </div>

    {/* Salary */}
    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Salary
      </label>

      {isEditable ? (
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <p className="text-lg font-medium text-gray-800">
          ₹ {salary || 0}
        </p>
      )}
    </div>

    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Net Hand Salary
      </label>

      {isEditable ? (
        <input
          type="number"
          value={netHandSalary}
          onChange={(e) => setNetHandSalary(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      ) : (
        <p className="text-lg font-medium text-gray-800">
          ₹ {netHandSalary || 0}
        </p>
      )}
    </div>

    {isEditable && (
      <div className="pt-4">
        <button
          onClick={handleSaveClick}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Save
        </button>
      </div>
    )}

  </div>
);
}

export default EmploymentDetails;