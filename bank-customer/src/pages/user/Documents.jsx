import React, { useEffect, useState } from "react";
import UserNavbar from "../../components/user/UserNavbar";

const Documents = () => {
  const [documents, setDocuments] = useState({
  panCard: null,
  aadharCard: null,
});
  const [panFile, setPanFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/user/documents", {
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
        throw new Error(data.message || "Failed to fetch documents");
      }

        setDocuments({
            panCard: data.documents?.panCard || null,
            aadharCard: data.documents?.aadharCard || null,
        });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handlePanUpload = async (e) => {
    e.preventDefault();
    if (!panFile) return;

    try {
      setUploadingPan(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("document", panFile);

      const res = await fetch("http://localhost:5000/api/user/documents/pan", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Request failed with status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload PAN card");
      }

      setMessage("PAN card uploaded successfully");
      setPanFile(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setUploadingPan(false);
    }
  };

  const handleAadharUpload = async (e) => {
    e.preventDefault();
    if (!aadharFile) return;

    try {
      setUploadingAadhar(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("document", aadharFile);

      const res = await fetch("http://localhost:5000/api/user/documents/aadhar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Request failed with status ${res.status}`);
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload Aadhaar card");
      }

      setMessage("Aadhaar card uploaded successfully");
      setAadharFile(null);
      fetchDocuments();
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setUploadingAadhar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
            Customer Documents
          </p>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Uploaded Documents
          </h1>
          <p className="mt-3 text-gray-600">
            View and manage your PAN and Aadhaar documents.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-6 text-gray-600 shadow-sm">
            Loading documents...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-green-700 shadow-sm">
            {message}
          </div>
        )}

        {!loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* PAN Card */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-semibold text-blue-900">
                PAN Card
              </h2>

              <p className="mb-4 text-gray-600">
                Status:{" "}
                <span className={documents.panCard ? "font-semibold text-green-600" : "font-semibold text-red-500"}>
                  {documents.panCard ? "Uploaded" : "Not Uploaded"}
                </span>
              </p>
               {documents.panCard && (
                <div className="mb-4 text-sm text-gray-600">
                    <p><span className="font-medium">File:</span> {documents.panCard.filename}</p>
                    <p>
                    <span className="font-medium">Uploaded:</span>{" "}
                    {new Date(documents.panCard.uploadedAt).toLocaleDateString()}
                    </p>
                </div>
                )}

              {documents.panCard && (
                <a
                  href={`http://localhost:5000/${documents.panCard.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-4 inline-block text-sm font-medium text-blue-700 hover:underline"
                >
                  View PAN Card
                </a>
              )}

              <form onSubmit={handlePanUpload} className="mt-4 space-y-4">
                <input
                  type="file"
                  onChange={(e) => setPanFile(e.target.files[0])}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />

                <button
                  type="submit"
                  disabled={uploadingPan}
                  className="rounded-xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:opacity-60"
                >
                  {uploadingPan ? "Uploading..." : documents.panCard ? "Update PAN Card" : "Upload PAN Card"}
                </button>
              </form>
            </div>

            {/* Aadhaar Card */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-semibold text-blue-900">
                Aadhaar Card
              </h2>

              <p className="mb-4 text-gray-600">
                Status:{" "}
                <span className={documents.aadharCard ? "font-semibold text-green-600" : "font-semibold text-red-500"}>
                  {documents.aadharCard ? "Uploaded" : "Not Uploaded"}
                </span>
              </p>
              {documents.aadharCard && (
                <div className="mb-4 text-sm text-gray-600">
                    <p><span className="font-medium">File:</span> {documents.aadharCard.filename}</p>
                    <p>
                        <span className="font-medium">Uploaded:</span>{" "}
                        {new Date(documents.aadharCard.uploadedAt).toLocaleDateString()}
                    </p>
                </div>
            )}

              {documents.aadharCard && (
                <a
                  href={`http://localhost:5000/${documents.aadharCard.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-4 inline-block text-sm font-medium text-blue-700 hover:underline"
                >
                  View Aadhaar Card
                </a>
              )}

              <form onSubmit={handleAadharUpload} className="mt-4 space-y-4">
                <input
                  type="file"
                  onChange={(e) => setAadharFile(e.target.files[0])}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />

                <button
                  type="submit"
                  disabled={uploadingAadhar}
                  className="rounded-xl bg-blue-900 px-5 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:opacity-60"
                >
                  {uploadingAadhar
                    ? "Uploading..."
                    : documents.aadharCard
                    ? "Update Aadhaar Card"
                    : "Upload Aadhaar Card"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;