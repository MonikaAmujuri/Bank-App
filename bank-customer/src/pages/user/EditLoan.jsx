import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";

const EditLoan = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  loanType: "",
  loanAmount: "",
  companyId: "",
  companyName: "",
  location: "",
  salary: "",
  netHandSalary: "",
  panNumber: "",
  aadhaarNumber: "",
  address: "",
  panFile: null,
  aadhaarFile: null,
  bankStatements: [],
  itReturns: [],
  payslips: [],
});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/user/my-loans/${loanId}`, {
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
          throw new Error(data.message || "Failed to fetch loan");
        }

        setStatus(data.status || "");

        setFormData({
          loanType: data.loanDetails?.loanType || "",
          loanAmount: data.loanDetails?.amount || "",
          companyId: data.employmentDetails?.companyId || "",
          companyName: data.employmentDetails?.companyName || "",
          location: data.employmentDetails?.location || "",
          salary: data.employmentDetails?.salary || "",
          netHandSalary: data.employmentDetails?.netHandSalary || "",
          panNumber: data.kycDetails?.panNumber || "",
          aadhaarNumber: data.kycDetails?.aadharNumber || "",
          address: data.kycDetails?.address || "",
        });
      } catch (error) {
        console.error(error);
        setSubmitError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [loanId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
  const { name, files, multiple } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: multiple ? Array.from(files) : files[0],
  }));
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);
    setSubmitError("");

    const token = localStorage.getItem("token");
    const data = new FormData();

    data.append("loanType", formData.loanType);
    data.append("loanAmount", formData.loanAmount);
    data.append("companyId", formData.companyId);
    data.append("companyName", formData.companyName);
    data.append("location", formData.location);
    data.append("salary", formData.salary);
    data.append("netHandSalary", formData.netHandSalary);
    data.append("panNumber", formData.panNumber);
    data.append("aadhaarNumber", formData.aadhaarNumber);
    data.append("address", formData.address);

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

    const res = await fetch(`http://localhost:5000/api/user/my-loans/${loanId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const text = await res.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error(`Request failed with status ${res.status}`);
    }

    if (!res.ok) {
      throw new Error(result.message || "Failed to update loan");
    }

    navigate(`/user/my-applications/${loanId}`);
  } catch (error) {
    console.error(error);
    setSubmitError(error.message || "Something went wrong");
  } finally {
    setSaving(false);
  }
};

  const editable = ["draft", "pending"].includes(status);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <UserNavbar />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Loan Application
          </p>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Edit Loan
          </h1>
          <p className="mt-3 text-gray-600">
            Update your loan details if the application is still editable.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">Loading loan...</div>
        )}

        {submitError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {submitError}
          </div>
        )}

        {!loading && !editable && (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-700 shadow-sm">
            This loan cannot be edited because its status is <strong>{status}</strong>.
          </div>
        )}

        {!loading && editable && (
          <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Loan Type
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Company ID
                </label>
                <input
                  type="text"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  PAN Number
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
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
                  rows="4"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 p-6">
  <h2 className="mb-6 text-2xl font-semibold text-blue-900">
    Replace Uploaded Documents
  </h2>

  <div className="grid gap-6 md:grid-cols-2">
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Replace PAN Card
      </label>
      <input
        type="file"
        name="panFile"
        onChange={handleFileChange}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
      <p className="mt-2 text-xs text-gray-500">
        Leave empty to keep existing PAN file
      </p>
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Replace Aadhaar Card
      </label>
      <input
        type="file"
        name="aadhaarFile"
        onChange={handleFileChange}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
      <p className="mt-2 text-xs text-gray-500">
        Leave empty to keep existing Aadhaar file
      </p>
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Replace Bank Statements
      </label>
      <input
        type="file"
        name="bankStatements"
        multiple
        onChange={handleFileChange}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
      <p className="mt-2 text-xs text-gray-500">
        Select files only if you want to replace existing bank statements
      </p>
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Replace IT Returns
      </label>
      <input
        type="file"
        name="itReturns"
        multiple
        onChange={handleFileChange}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
      <p className="mt-2 text-xs text-gray-500">
        Select files only if you want to replace existing IT returns
      </p>
    </div>

    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Replace Payslips
      </label>
      <input
        type="file"
        name="payslips"
        multiple
        onChange={handleFileChange}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
      <p className="mt-2 text-xs text-gray-500">
        Select files only if you want to replace existing payslips
      </p>
    </div>
  </div>
</div>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => navigate(`/user/my-applications/${loanId}`)}
                className="rounded-xl border border-blue-900 px-6 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditLoan;