import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const AdminLoanDetails = () => {
  const { loanId } = useParams();
  const { token } = useAuth();

  const [loan, setLoan] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedLoan, setEditedLoan] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchLoan();
  }, [loanId, token]);

  const fetchLoan = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/loans/${loanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setLoan(null);
        setEditedLoan(null);
        return;
      }

      const data = await res.json();
      setLoan(data);
      setEditedLoan(data);
    } catch (error) {
      console.error(error);
      setLoan(null);
      setEditedLoan(null);
    }
  };

  const handleSave = async () => {
    try {
      const sections = [
        { section: "loanDetails", data: editedLoan.loanDetails },
        { section: "employmentDetails", data: editedLoan.employmentDetails },
        { section: "kycDetails", data: editedLoan.kycDetails },
      ];

      for (const payload of sections) {
        const res = await fetch(
          `http://localhost:5000/api/loans/${loan.loanId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `Failed to update ${payload.section}`);
        }
      }

      setEditing(false);
      await fetchLoan();
      alert("Loan updated successfully");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update loan");
    }
  };

  const handleCancel = () => {
    setEditedLoan(loan);
    setEditing(false);
  };
 

  if (!loan || !editedLoan)
    return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
  <h1 className="text-2xl font-semibold mb-6">
    Loan Details - {loan.loanId}
  </h1>

  <div className="bg-white shadow rounded-2xl p-8 space-y-8">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-base font-medium capitalize">{loan.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="text-base font-medium">
              {new Date(loan.createdAt).toLocaleDateString()}
            </p>
          </div>
          {loan.lastModifiedBy && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Last Modified By</p>
              <p className="text-base font-medium">
                {loan.lastModifiedBy.name} ({loan.lastModifiedBy.role})
              </p>
            </div>
          )}
        </div>
        <hr className="my-6 border-gray-200" />
      </div>
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Edit Loan
        </button>
      ) : (
        <div className="space-x-3">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
      
    </div>

    {loan.loanDetails && !editing && (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-base font-medium">₹{loan.loanDetails?.amount || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Interest Rate</p>
            <p className="text-base font-medium">
              {loan.loanDetails?.interestRate ? `${loan.loanDetails.interestRate}%` : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tenure</p>
            <p className="text-base font-medium">
              {loan.loanDetails?.tenure ? `${loan.loanDetails.tenure} months` : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Loan Type</p>
            <p className="text-base font-medium capitalize">
              {loan.loanDetails?.loanType || "-"}
            </p>
          </div>
        </div>
      </div>
    )}
    <hr className="my-6 border-gray-200" />

    {loan.employmentDetails && !editing && (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Employment Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Company ID</p>
            <p className="text-base font-medium">
              {loan.employmentDetails?.companyId || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Company</p>
            <p className="text-base font-medium">
              {loan.employmentDetails?.companyName || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-base font-medium">
              {loan.employmentDetails?.location || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Salary</p>
            <p className="text-base font-medium">
              ₹{loan.employmentDetails?.salary || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Net Salary</p>
            <p className="text-base font-medium">
              ₹{loan.employmentDetails?.netsalary || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Job Title</p>
            <p className="text-base font-medium">
              {loan.employmentDetails?.jobTitle || "-"}
            </p>
          </div>
        </div>
      </div>
    )}
    <hr className="my-6 border-gray-200" />

    {loan.kycDetails && !editing && (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">KYC Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Aadhaar</p>
            <p className="text-base font-medium">{loan.kycDetails?.aadharNumber || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">PAN</p>
            <p className="text-base font-medium">{loan.kycDetails?.panNumber || "-"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Address</p>
            <p className="text-base font-medium">{loan.kycDetails?.address || "-"}</p>
          </div>
        </div>
      </div>
    )}

    {editing && (
      <>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Loan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount</p>
            <input
              type="number"
              placeholder="Amount"
              value={editedLoan?.loanDetails?.amount || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  loanDetails: {
                    ...editedLoan.loanDetails,
                    amount: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Interest Rate (%)</p>
            <input
              type="number"
              placeholder="Interest Rate"
              value={editedLoan?.loanDetails?.interestRate || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  loanDetails: {
                    ...editedLoan.loanDetails,
                    interestRate: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tenure (months)</p>
            <input
              type="number"
              placeholder="Tenure (months)"
              value={editedLoan?.loanDetails?.tenure || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  loanDetails: {
                    ...editedLoan.loanDetails,
                    tenure: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Loan Type</p>
                  <select
                    value={editedLoan?.loanDetails?.loanType || ""}
                    onChange={(e) =>
                      setEditedLoan({
                        ...editedLoan,
                        loanDetails: {
                          ...editedLoan.loanDetails,
                          loanType: e.target.value,
                        },
                      })
                    }
                    className="border rounded px-3 py-2 w-full"
                  >
                    <option value="">Select Loan Type</option>
                    <option value="home">Home Loan</option>
                    <option value="personal">Personal Loan</option>
                    <option value="education">Education Loan</option>
                    <option value="vehicle">Vehicle Loan</option>
                    <option value="business">Business Loan</option>
                  </select>
                </div>

          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Employment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Company ID</p>
            <input
              type="text"
              placeholder="Company ID"
              value={editedLoan?.employmentDetails?.companyId || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  employmentDetails: {
                    ...editedLoan.employmentDetails,
                    companyId: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Company Name</p>
            <input
              type="text"
              placeholder="Company Name"
              value={editedLoan?.employmentDetails?.companyName || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  employmentDetails: {
                    ...editedLoan.employmentDetails,
                    companyName: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
            <div>
              <p className= "text-sm text-gray-500 mb-1">Job Title</p>
            <input
              type="text"
              placeholder="Job Title"
              value={editedLoan?.employmentDetails?.jobTitle || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  employmentDetails: {
                    ...editedLoan.employmentDetails,
                    jobTitle: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
            <div>
              <p className= "text-sm text-gray-500 mb-1">Location</p>
            <input
              type="text"
              placeholder="Location"
              value={editedLoan?.employmentDetails?.location || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  employmentDetails: {
                    ...editedLoan.employmentDetails,
                    location: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
            <div>
              <p className= "text-sm text-gray-500 mb-1">Salary</p>
            <input
              type="number"
              placeholder="Salary"
              value={editedLoan?.employmentDetails?.salary || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  employmentDetails: {
                    ...editedLoan.employmentDetails,
                    salary: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
            <div>
              <p className= "text-sm text-gray-500 mb-1">Net Salary</p>
            <input
              type="number"
              placeholder="Net Salary"
              value={editedLoan?.employmentDetails?.netsalary || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  employmentDetails: {
                    ...editedLoan.employmentDetails,
                    netsalary: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">KYC Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className= "text-sm text-gray-500 mb-1">Aadhaar Number</p>
            <input
              type="text"
              placeholder="Aadhaar"
              value={editedLoan?.kycDetails?.aadharNumber || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  kycDetails: {
                    ...editedLoan.kycDetails,
                    aadharNumber: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
            <div>
              <p className= "text-sm text-gray-500 mb-1">PAN Number</p>
            <input
              type="text"
              placeholder="PAN"
              value={editedLoan?.kycDetails?.panNumber || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  kycDetails: {
                    ...editedLoan.kycDetails,
                    panNumber: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full"
            />
            </div>
            <div>
              <p className= "text-sm text-gray-500 mb-1">Address</p>
            <input
              type="text"
              placeholder="Address"
              value={editedLoan?.kycDetails?.address || ""}
              onChange={(e) =>
                setEditedLoan({
                  ...editedLoan,
                  kycDetails: {
                    ...editedLoan.kycDetails,
                    address: e.target.value,
                  },
                })
              }
              className="border rounded px-3 py-2 w-full md:col-span-2"
            />
            </div>
          </div>
        </div>
      </>
    )}
  </div>
</div>
  );
};

export default AdminLoanDetails;


