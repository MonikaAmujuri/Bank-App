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
  const [agents, setAgents] = useState([]);
const [selectedAgent, setSelectedAgent] = useState("");
const [assigning, setAssigning] = useState(false);
const [assignMessage, setAssignMessage] = useState("");
const [assignError, setAssignError] = useState("");


  

  useEffect(() => {
  if (!token) return;
  fetchLoan();
  fetchAgents();
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
      setSelectedAgent(data.agentId?._id || "");
    } catch (error) {
      console.error(error);
      setLoan(null);
      setEditedLoan(null);
    }
  };

  const fetchAgents = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/admin/agents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setAgents(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
    setAgents([]);
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

  const handleAssignAgent = async () => {
  if (!selectedAgent) {
    setAssignError("Please select an agent");
    return;
  }

  try {
    setAssigning(true);
    setAssignError("");
    setAssignMessage("");

    const res = await fetch(
      `http://localhost:5000/api/admin/loans/${loan.loanId}/assign-agent`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ agentId: selectedAgent }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to assign agent");
    }

    setAssignMessage("Agent assigned successfully");
    await fetchLoan();
  } catch (error) {
    console.error(error);
    setAssignError(error.message || "Something went wrong");
  } finally {
    setAssigning(false);
  }
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
        <div>
  <h2 className="mb-4 text-xl font-semibold text-gray-800">Assign Agent</h2>

  <p className="mb-4 text-sm text-gray-600">
    Current Assigned Agent:{" "}
    <span className="font-medium text-gray-900">
      {loan.agentId?.name || "Unassigned"}
    </span>
  </p>

  {assignError && (
    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
      {assignError}
    </div>
  )}

  {assignMessage && (
    <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
      {assignMessage}
    </div>
  )}

  <div className="flex flex-col gap-4 md:flex-row md:items-center">
    <select
      value={selectedAgent}
      onChange={(e) => setSelectedAgent(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 md:w-80"
    >
      <option value="">Select Agent</option>
      {agents.map((agent) => (
        <option key={agent._id} value={agent._id}>
          {agent.name} ({agent.agentId})
        </option>
      ))}
    </select>

    <button
      onClick={handleAssignAgent}
      disabled={assigning}
      className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
    >
      {assigning
        ? "Saving..."
        : loan.agentId
        ? "Change Agent"
        : "Assign Agent"}
    </button>
  </div>
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

    {loan.kycDetails && (
  <>
    <hr className="my-6 border-gray-200" />

    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        Uploaded Documents
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="mb-2 font-medium text-gray-800">PAN Card</p>
          {loan.kycDetails?.panFile ? (
            <a
              href={loan.kycDetails.panFile}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              View PAN Card
            </a>
          ) : (
            <p className="text-sm text-red-500">Not uploaded</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="mb-2 font-medium text-gray-800">Aadhaar Card</p>
          {loan.kycDetails?.aadhaarFile ? (
            <a
              href={loan.kycDetails.aadhaarFile}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Aadhaar Card
            </a>
          ) : (
            <p className="text-sm text-red-500">Not uploaded</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="mb-2 font-medium text-gray-800">Bank Statements</p>
          {loan.kycDetails?.bankStatements?.length > 0 ? (
            <div className="space-y-2">
              {loan.kycDetails.bankStatements.map((file, index) => (
                <a
                  key={index}
                  href={loan.kycDetails.bankStatements[index]}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  View Bank Statement {index + 1}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-red-500">Not uploaded</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="mb-2 font-medium text-gray-800">IT Returns</p>
          {loan.kycDetails?.itReturns?.length > 0 ? (
            <div className="space-y-2">
              {loan.kycDetails.itReturns.map((file, index) => (
                <a
                  key={index}
                  href={loan.kycDetails.itReturns[index]}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  View IT Return {index + 1}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-red-500">Not uploaded</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="mb-2 font-medium text-gray-800">Payslips</p>
          {loan.kycDetails?.payslips?.length > 0 ? (
            <div className="space-y-2">
              {loan.kycDetails.payslips.map((file, index) => (
                <a
                  key={index}
                  href={loan.kycDetails.payslips[index] }
                  target="_blank"
                  rel="noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  View Payslip {index + 1}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-red-500">Not uploaded</p>
          )}
        </div>
      </div>
    </div>
  </>
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


