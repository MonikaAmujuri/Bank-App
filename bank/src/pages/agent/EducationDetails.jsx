import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";

const EducationDetails = ({ data, isEditable, onSave }) => {
  const [institutionName, setInstitutionName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [instituteLocation, setInstituteLocation] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setInstitutionName(data.institutionName || "");
      setCourseName(data.courseName || "");
      setCourseDuration(data.courseDuration || "");
      setInstituteLocation(data.instituteLocation || "");
      setCourseFee(data.courseFee || "");
      setStudyYear(data.studyYear || "");
    }
  }, [data]);

  const validateTextField = (value) =>
    /^[A-Za-z0-9\s&.,'()\/-]+$/.test(String(value).trim());

  const validateNumbersOnly = (value) =>
    /^\d+(\.\d+)?$/.test(String(value).trim());

  const handleSaveClick = () => {
    const newErrors = {};

    const trimmedInstitutionName = String(institutionName).trim();
    const trimmedCourseName = String(courseName).trim();
    const trimmedCourseDuration = String(courseDuration).trim();
    const trimmedInstituteLocation = String(instituteLocation).trim();
    const trimmedCourseFee = String(courseFee).trim();
    const trimmedStudyYear = String(studyYear).trim();

    if (!trimmedInstitutionName) {
      newErrors.institutionName = "Institution name is required";
    } else if (!validateTextField(trimmedInstitutionName)) {
      newErrors.institutionName = "Enter a valid institution name";
    }

    if (!trimmedCourseName) {
      newErrors.courseName = "Course name is required";
    } else if (!validateTextField(trimmedCourseName)) {
      newErrors.courseName = "Enter a valid course name";
    }

    if (!trimmedCourseDuration) {
      newErrors.courseDuration = "Course duration is required";
    } else if (!validateTextField(trimmedCourseDuration)) {
      newErrors.courseDuration = "Enter a valid course duration";
    }

    if (!trimmedInstituteLocation) {
      newErrors.instituteLocation = "Institute location is required";
    } else if (!validateTextField(trimmedInstituteLocation)) {
      newErrors.instituteLocation = "Enter a valid institute location";
    }

    if (!trimmedCourseFee) {
      newErrors.courseFee = "Course fee is required";
    } else if (!validateNumbersOnly(trimmedCourseFee)) {
      newErrors.courseFee = "Enter only numbers";
    } else if (Number(trimmedCourseFee) <= 0) {
      newErrors.courseFee = "Course fee must be greater than 0";
    }

    if (!trimmedStudyYear) {
      newErrors.studyYear = "Current year of study is required";
    } else if (!validateTextField(trimmedStudyYear)) {
      newErrors.studyYear = "Enter a valid year of study";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave("educationDetails", {
      institutionName: trimmedInstitutionName,
      courseName: trimmedCourseName,
      courseDuration: trimmedCourseDuration,
      instituteLocation: trimmedInstituteLocation,
      courseFee: trimmedCourseFee,
      studyYear: trimmedStudyYear,
    });
  };

  const getFieldClass = (fieldName) =>
    `w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
      errors[fieldName] ? "border-red-300" : "border-gray-300"
    }`;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Education Details
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and update the applicant’s education and course information.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-blue-100 bg-white/80 text-blue-600 shadow-sm">
            <GraduationCap className="h-7 w-7" strokeWidth={2.2} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Institution Name
            </label>
            {isEditable ? (
              <>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInstitutionName(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        institutionName: "Institution name is required",
                      }));
                    } else if (!validateTextField(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        institutionName: "Enter a valid institution name",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, institutionName: "" }));
                    }
                  }}
                  className={getFieldClass("institutionName")}
                  placeholder="Enter institution name"
                  required
                />
                {errors.institutionName && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.institutionName}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {institutionName || "N/A"}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Course Name
            </label>
            {isEditable ? (
              <>
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCourseName(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        courseName: "Course name is required",
                      }));
                    } else if (!validateTextField(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        courseName: "Enter a valid course name",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, courseName: "" }));
                    }
                  }}
                  className={getFieldClass("courseName")}
                  placeholder="Enter course name"
                  required
                />
                {errors.courseName && (
                  <p className="mt-2 text-sm text-red-500">{errors.courseName}</p>
                )}
              </>
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {courseName || "N/A"}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Course Duration
            </label>
            {isEditable ? (
              <>
                <input
                  type="text"
                  value={courseDuration}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCourseDuration(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        courseDuration: "Course duration is required",
                      }));
                    } else if (!validateTextField(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        courseDuration: "Enter a valid course duration",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, courseDuration: "" }));
                    }
                  }}
                  className={getFieldClass("courseDuration")}
                  placeholder="Example: 4 Years"
                  required
                />
                {errors.courseDuration && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.courseDuration}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {courseDuration || "N/A"}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Institute Location
            </label>
            {isEditable ? (
              <>
                <input
                  type="text"
                  value={instituteLocation}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInstituteLocation(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        instituteLocation: "Institute location is required",
                      }));
                    } else if (!validateTextField(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        instituteLocation: "Enter a valid institute location",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, instituteLocation: "" }));
                    }
                  }}
                  className={getFieldClass("instituteLocation")}
                  placeholder="Enter institute location"
                  required
                />
                {errors.instituteLocation && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.instituteLocation}
                  </p>
                )}
              </>
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {instituteLocation || "N/A"}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Total Course Fee
            </label>
            {isEditable ? (
              <>
                <input
                  type="text"
                  value={courseFee}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCourseFee(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        courseFee: "Course fee is required",
                      }));
                    } else if (!validateNumbersOnly(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        courseFee: "Enter only numbers",
                      }));
                    } else if (Number(value) <= 0) {
                      setErrors((prev) => ({
                        ...prev,
                        courseFee: "Course fee must be greater than 0",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, courseFee: "" }));
                    }
                  }}
                  className={getFieldClass("courseFee")}
                  placeholder="Enter total course fee"
                  required
                />
                {errors.courseFee && (
                  <p className="mt-2 text-sm text-red-500">{errors.courseFee}</p>
                )}
              </>
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {courseFee ? `₹ ${courseFee}` : "₹ 0"}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Current Year of Study
            </label>
            {isEditable ? (
              <>
                <input
                  type="text"
                  value={studyYear}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStudyYear(value);

                    if (!value.trim()) {
                      setErrors((prev) => ({
                        ...prev,
                        studyYear: "Current year of study is required",
                      }));
                    } else if (!validateTextField(value)) {
                      setErrors((prev) => ({
                        ...prev,
                        studyYear: "Enter a valid year of study",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, studyYear: "" }));
                    }
                  }}
                  className={getFieldClass("studyYear")}
                  placeholder="Example: 2nd Year"
                  required
                />
                {errors.studyYear && (
                  <p className="mt-2 text-sm text-red-500">{errors.studyYear}</p>
                )}
              </>
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {studyYear || "N/A"}
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
              Save Education Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationDetails;