import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "documents_pending",
        "approved",
        "rejected",
        "disbursed",
      ],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const loanSchema = new mongoose.Schema(
  {
    loanId: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    userObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdByRole: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },

    loanDetails: {
      type: Object,
      default: {},
    },

    employmentDetails: {
      type: Object,
      default: {},
    },

    kycDetails: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "documents_pending",
        "approved",
        "rejected",
        "disbursed",
      ],
      default: "draft",
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },

    remarks: {
      type: String,
      default: "",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);