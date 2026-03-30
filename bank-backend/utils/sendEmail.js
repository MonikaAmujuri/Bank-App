import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendLoanSubmittedEmail = async ({ to, name, loanId }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Loan Application Submitted Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Loan Application Submitted</h2>
        <p>Hello ${name || "Customer"},</p>
        <p>Your loan application has been submitted successfully.</p>
        <p><strong>Loan ID:</strong> ${loanId}</p>
        <p>Please save this Loan ID for future reference.</p>
        <p>Thank you.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendLoanAppliedEmail = async ({ to, name, loanId }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Loan Application Received",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Loan Application Received</h2>
        <p>Hello ${name || "Customer"},</p>
        <p>We have received your loan application successfully.</p>
        <p><strong>Loan ID:</strong> ${loanId}</p>
        <p>Please save this Loan ID for future reference.</p>
        <p>Our team will review your application and update you soon.</p>
        <p>Thank you.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendLoanStatusEmail = async ({ to, name, loanId, status, note }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "submitted":
        return "Application Submitted";
      case "under_review":
        return "Under Review";
      case "documents_pending":
        return "Documents Needed";
      case "approved":
        return "Approved";
      case "rejected":
        return "Not Approved";
      case "disbursed":
        return "Disbursed";
      default:
        return status;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "draft":
        return "Your loan application has been moved to draft.";
      case "submitted":
        return "We have received your loan application successfully.";
      case "under_review":
        return "Your loan application is currently under review.";
      case "documents_pending":
        return "We need some additional documents or corrections to continue processing your application.";
      case "approved":
        return "Good news — your loan application has been approved.";
      case "rejected":
        return "Your loan application is rejected due to invalid details/documents.";
      case "disbursed":
        return "Your approved loan amount has been disbursed successfully.";
      default:
        return "Your loan application status has been updated.";
    }
  };

  const statusLabel = getStatusLabel(status);
  const statusMessage = getStatusMessage(status);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Loan Status Updated - ${statusLabel}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Loan Application Status Updated</h2>
        <p>Hello ${name || "Customer"},</p>
        <p>${statusMessage}</p>
        <p><strong>Loan ID:</strong> ${loanId}</p>
        <p><strong>New Status:</strong> ${statusLabel}</p>
        ${note ? `<p><strong>Update Note:</strong> ${note}</p>` : ""}
        <p>Please log in to your account to view the latest details.</p>
        <p>Thank you.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};