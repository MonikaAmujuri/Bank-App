import React, { useEffect, useState } from "react";
import UserNavbar from "../../components/user/UserNavbar";
import { FileText } from "lucide-react";

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

  const totalUploaded = [documents.panCard, documents.aadharCard].filter(Boolean).length;

  const fileInputClass =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

  const DocumentVaultCard = ({
    title,
    doc,
    onFileChange,
    onSubmit,
    uploading,
    buttonLabel,
    emptyLabel,
    viewLabel,
    accent = "blue",
  }) => {
    const accentMap = {
      blue: {
        badge: doc
          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border border-red-200 bg-red-50 text-red-600",
        headerIcon: "bg-blue-50 text-blue-700",
        infoBox: "border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50",
      },
      violet: {
        badge: doc
          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border border-red-200 bg-red-50 text-red-600",
        headerIcon: "bg-violet-50 text-violet-700",
        infoBox: "border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-fuchsia-50",
      },
    };

    return (
      <div className="rounded-[30px] border border-gray-100 bg-white p-6 shadow-[0_14px_45px_rgba(15,23,42,0.07)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <FileText className="h-6 w-6" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {doc
                  ? "Your document is available and can be updated anytime."
                  : "Upload this document to keep your profile ready for loan processing."}
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold ${accentMap[accent].badge}`}
          >
            {doc ? "Uploaded" : "Missing"}
          </span>
        </div>

        <div className={`mb-5 rounded-[24px] p-4 ${accentMap[accent].infoBox}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
            Document Status
          </p>

          {doc ? (
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">File:</span>{" "}
                {doc.filename}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Uploaded:</span>{" "}
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-600">{emptyLabel}</p>
          )}
        </div>

        {doc && (
          <a
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            className="mb-5 inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            <span>{viewLabel}</span>
            <span>↗</span>
          </a>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-[24px] border border-dashed border-gray-200 bg-gray-50 p-4">
            <label className="mb-3 block text-sm font-semibold text-gray-800">
              {doc ? `Replace ${title}` : `Upload ${title}`}
            </label>

            <input
              type="file"
              onChange={onFileChange}
              className={fileInputClass}
            />

            <p className="mt-3 text-xs text-gray-500">
              Choose a clear and readable document before updating.
            </p>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="rounded-2xl bg-blue-900 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "Uploading..." : buttonLabel}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section className="relative mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-8 py-10 shadow-[0_18px_50px_rgba(59,130,246,0.10)] ring-1 ring-blue-100 md:px-10">
          <div className="absolute inset-0 opacity-60">
            <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-100 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                Customer Documents
              </p>
              <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
                Uploaded Documents
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-gray-600">
                View and manage your PAN and Aadhaar documents securely from one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:w-[360px]">
              <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                <p className="text-2xl font-bold text-blue-900">{totalUploaded}</p>
                <p className="mt-1 text-xs text-gray-500">Uploaded</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100">
                <p className="text-2xl font-bold text-blue-900">2</p>
                <p className="mt-1 text-xs text-gray-500">Required</p>
              </div>
              <div className="col-span-2 rounded-2xl bg-white/80 px-4 py-4 text-center shadow-sm ring-1 ring-gray-100 sm:col-span-1">
                <p className="text-2xl font-bold text-blue-900">
                  {totalUploaded === 2 ? "Ready" : "Pending"}
                </p>
                <p className="mt-1 text-xs text-gray-500">Verification</p>
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <div className="rounded-[28px] bg-white p-6 text-gray-600 shadow-sm ring-1 ring-gray-100">
            Loading documents...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 p-4 text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-[24px] border border-green-200 bg-green-50 p-4 text-green-700 shadow-sm">
            {message}
          </div>
        )}

        {!loading && (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <DocumentVaultCard
                title="PAN Card"
                doc={documents.panCard}
                onFileChange={(e) => setPanFile(e.target.files[0])}
                onSubmit={handlePanUpload}
                uploading={uploadingPan}
                buttonLabel={
                  documents.panCard ? "Update PAN Card" : "Upload PAN Card"
                }
                emptyLabel="PAN card is not uploaded yet."
                viewLabel="View PAN Card"
                accent="blue"
              />

              <DocumentVaultCard
                title="Aadhaar Card"
                doc={documents.aadharCard}
                onFileChange={(e) => setAadharFile(e.target.files[0])}
                onSubmit={handleAadharUpload}
                uploading={uploadingAadhar}
                buttonLabel={
                  documents.aadharCard
                    ? "Update Aadhaar Card"
                    : "Upload Aadhaar Card"
                }
                emptyLabel="Aadhaar card is not uploaded yet."
                viewLabel="View Aadhaar Card"
                accent="violet"
              />
            </div>

            <div className="mt-8 rounded-[30px] bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white shadow-[0_18px_45px_rgba(30,64,175,0.22)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100">
                    Helpful Note
                  </p>
                  <h3 className="mt-2 text-2xl font-bold">
                    Keep your documents updated
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-blue-100">
                    Keeping your PAN and Aadhaar documents current helps speed up
                    verification and supports a smoother loan application journey.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-100 backdrop-blur-sm">
                  Secure customer document center
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Documents;