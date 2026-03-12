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
    <div className="space-y-6">

      <div>
        <label className="block text-sm text-gray-500 mb-1">
          Aadhar Number
        </label>

        {isEditable ? (
          <input
            type="text"
            value={aadharNumber}
            onChange={(e) => setAadharNumber(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        ) : (
          <p className="text-lg font-medium text-gray-800">
            {aadharNumber || "-"}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">
          PAN Number.
        </label>

        {isEditable ? (
          <input
            type="text"
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        ) : (
          <p className="text-lg font-medium text-gray-800">
            {panNumber || "-"}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">
          Address
        </label>

        {isEditable ? (
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        ) : (
          <p className="text-lg font-medium text-gray-800">
            {address || "-"}
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
};

export default KYCDetails;