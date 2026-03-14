import React from "react";
import { useState, useEffect } from "react";

const KYCDetails = ({ data, isEditable, onSave }) => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (data) {
      setAadharNumber(data.aadharNumber || "");
      setPanNumber(data.panNumber || "");
      setAddress(data.address || "");
    }
  }, [data]);

  const handleSaveClick = () => {
    onSave("kycDetails", {
      aadharNumber,
      panNumber,
      address,
    });
  };

  return (
  <div className="space-y-8">
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">KYC Details</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and update the applicant’s identity and address details.
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl text-green-600">
          🪪
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Aadhar Number
          </label>

          {isEditable ? (
            <input
              type="text"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter Aadhar number"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {aadharNumber || "-"}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            PAN Number
          </label>

          {isEditable ? (
            <input
              type="text"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter PAN number"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {panNumber || "-"}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-gray-50 p-5 md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-500">
            Address
          </label>

          {isEditable ? (
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter address"
              rows={4}
            />
          ) : (
            <p className="text-lg font-semibold text-gray-900">
              {address || "-"}
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
            Save KYC Details
          </button>
        </div>
      )}
    </div>
  </div>
);
};

export default KYCDetails;