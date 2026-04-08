import React from "react";
import { useState, useEffect } from "react";
import { IdCard } from "lucide-react";

const KYCDetails = ({ data, isEditable, onSave }) => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setAadharNumber(data.aadharNumber || "");
      setPanNumber(data.panNumber || "");
      setAddress(data.address || "");
    }
  }, [data]);

  const validateNumbersOnly = (value) => /^\d+$/.test(String(value).trim());
  const validatePan = (value) =>
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(value).trim());
  const validateAddress = (value) =>
    /^[A-Za-z0-9\s&.,'()\/-]+$/.test(String(value).trim());

  const handleSaveClick = () => {
    const newErrors = {};

    const trimmedAadharNumber = String(aadharNumber).trim();
    const trimmedPanNumber = String(panNumber).trim().toUpperCase();
    const trimmedAddress = String(address).trim();

    if (!trimmedAadharNumber) {
      newErrors.aadharNumber = "Aadhaar number is required";
    } else if (!validateNumbersOnly(trimmedAadharNumber)) {
      newErrors.aadharNumber = "Enter only numbers";
    } else if (trimmedAadharNumber.length !== 12) {
      newErrors.aadharNumber = "Aadhaar number must be 12 digits";
    }

    if (!trimmedPanNumber) {
      newErrors.panNumber = "PAN number is required";
    } else if (!validatePan(trimmedPanNumber)) {
      newErrors.panNumber = "Enter a valid PAN number";
    }

    if (!trimmedAddress) {
      newErrors.address = "Address is required";
    } else if (!validateAddress(trimmedAddress)) {
      newErrors.address = "Enter a valid address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave("kycDetails", {
      aadharNumber: trimmedAadharNumber,
      panNumber: trimmedPanNumber,
      address: trimmedAddress,
    });
  };

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
              KYC Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and update the applicant’s identity and address details.
            </p>
          </div>

          <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-2xl sm:rounded-3xl border border-violet-100 bg-white/80 text-violet-600 shadow-sm shrink-0">
            <IdCard className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2.2} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Aadhaar Number
            </label>

            {isEditable ? (
              <>
                <input
                  type="text"
                  value={aadharNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAadharNumber(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        aadharNumber: "Aadhaar number is required",
                      }));
                    } else if (!validateNumbersOnly(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        aadharNumber: "Enter only numbers",
                      }));
                    } else if (value.trim().length !== 12) {
                      setErrors((prev) => ({
                        ...prev,
                        aadharNumber: "Aadhaar number must be 12 digits",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, aadharNumber: "" }));
                    }
                  }}
                  className={getFieldClass("aadharNumber")}
                  placeholder="Enter Aadhaar number"
                  maxLength={12}
                  required
                />
                {errors.aadharNumber && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.aadharNumber}
                  </p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-all">
                {aadharNumber || "N/A"}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              PAN Number
            </label>

            {isEditable ? (
              <>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setPanNumber(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        panNumber: "PAN number is required",
                      }));
                    } else if (!validatePan(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        panNumber: "Enter a valid PAN number",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, panNumber: "" }));
                    }
                  }}
                  className={getFieldClass("panNumber")}
                  placeholder="Enter PAN number"
                  maxLength={10}
                  required
                />
                {errors.panNumber && (
                  <p className="mt-2 text-sm text-red-500">{errors.panNumber}</p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-all">
                {panNumber || "N/A"}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 sm:p-5 md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-500">
              Address
            </label>

            {isEditable ? (
              <>
                <textarea
                  value={address}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAddress(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        address: "Address is required",
                      }));
                    } else if (!validateAddress(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        address: "Enter a valid address",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, address: "" }));
                    }
                  }}
                  className={getFieldClass("address")}
                  placeholder="Enter address"
                  rows={4}
                  required
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-500">{errors.address}</p>
                )}
              </>
            ) : (
              <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                {address || "N/A"}
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
              Save KYC Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCDetails;