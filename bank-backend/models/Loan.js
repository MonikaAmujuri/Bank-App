import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    loanId: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: String, // USR000X
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
      enum: ["draft", "pending", "approved", "rejected", "modified"],
      default: "draft",
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
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);