import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    firebaseUid: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: null,
    },

    panNumber: {
      type: String,
      default: "",
    },

    aadharNumber: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    documents: {
  panCard: {
    url: { type: String, default: "" },
    filename: { type: String, default: "" },
    uploadedAt: { type: Date, default: null },
  },
  aadharCard: {
    url: { type: String, default: "" },
    filename: { type: String, default: "" },
    uploadedAt: { type: Date, default: null },
  },
},

    role: {
      type: String,
      enum: ["admin", "agent", "user"],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    userId: {
      type: String,
      unique: true,
      sparse: true,
    },

    location: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    agentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;