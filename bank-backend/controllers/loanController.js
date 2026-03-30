import Loan from "../models/Loan.js";
import User from "../models/User.js";
import { sendLoanSubmittedEmail } from "../utils/sendEmail.js";
import { generateLoanId } from "../utils/generateLoanId.js";
import { sendLoanAppliedEmail } from "../utils/sendEmail.js";
import { sendLoanStatusEmail } from "../utils/sendEmail.js";

export const startLoan = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed for this user" });
    }

    const loanId = await generateLoanId();

    const loan = await Loan.create({
      loanId,
      userId: user.userId,
      userObjectId: user._id,
      agentId: req.user._id,
      createdBy: req.user._id,
      createdByRole: "agent",

      kycDetails: {
        aadharNumber: user.aadharNumber || "",
        panNumber: user.panNumber || "",
        address: user.address || "",
      },

      status: "draft",
      statusHistory: [
        {
          status: "draft",
          changedBy: req.user._id,
          note: "Loan initiated and saved as draft",
        },
      ],
    });

    res.status(201).json({
      message: "Loan draft created",
      loan: {
        loanId: loan.loanId,
        status: loan.status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { section, data } = req.body;

    const loan = await Loan.findOne({ loanId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (
      req.user.role === "agent" &&
      loan.agentId &&
      loan.agentId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to update this loan" });
    }

    if (
      req.user.role === "agent" &&
      !["draft", "documents_pending"].includes(loan.status)
    ) {
      return res.status(400).json({
        message: "Only draft or documents pending loans can be edited",
      });
    }

    if (
      req.user.role === "admin" &&
      !["draft", "documents_pending"].includes(loan.status)
    ) {
      return res.status(400).json({
        message: "Only draft or documents pending loans can be edited",
      });
    }

    if (
      req.user.role === "user" &&
      !["draft", "documents_pending"].includes(loan.status)
    ) {
      return res.status(400).json({
        message: "Only draft or documents pending loans can be edited",
      });
    }

    const allowedSections = ["loanDetails", "employmentDetails", "kycDetails"];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({ message: "Invalid section" });
    }

    if (section === "loanDetails") {
      const { amount, loanType, interestRate, tenure } = data;

      if (!amount || !loanType || !interestRate || !tenure) {
        return res.status(400).json({
          message: "All loan details are required",
        });
      }

      if (amount <= 0 || interestRate <= 0 || tenure <= 0) {
        return res.status(400).json({
          message: "Amount, Interest Rate and Tenure must be greater than 0",
        });
      }
    }

    if (section === "employmentDetails") {
      const { companyName, salary } = data;

      if (!companyName || !salary) {
        return res.status(400).json({
          message: "Employment details are required",
        });
      }
    }

    let normalizedData = data;

    if (section === "kycDetails") {
      const aadharNumber = data?.aadharNumber || data?.aadhaar;
      const panNumber = data?.panNumber || data?.pan;

      if (!aadharNumber || !panNumber) {
        return res.status(400).json({
          message: "KYC details are required",
        });
      }

      const { aadhaar, pan, ...rest } = data;
      normalizedData = {
        ...rest,
        aadharNumber,
        panNumber,
      };
    }

    loan[section] = {
      ...loan[section],
      ...normalizedData,
    };

    loan.markModified(section);
    loan.lastModifiedBy = req.user._id;

    await loan.save();

    res.status(200).json({
      message: `${section} updated successfully`,
      loanId: loan.loanId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

 export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId })
      .populate("lastModifiedBy", "name role")
      .populate("agentId", "name agentId")
      .populate("userObjectId", "name userId")
      .populate("statusHistory.changedBy", "name role");

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.json(loan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const archiveLoan = async (req, res) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findOne({ loanId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.isArchived = true;
    await loan.save();

    res.status(200).json({
      message: "Loan archived successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const restoreLoan = async (req, res) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findOne({ loanId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.isArchived = false;
    await loan.save();

    res.status(200).json({
      message: "Loan restored successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const submitLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (!loan.agentId || loan.agentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!["draft", "submitted"].includes(loan.status)) {
      return res.status(400).json({
        message: "Only draft or submitted loans can be moved to review",
      });
    }

    loan.status = "under_review";
    loan.approvedBy = req.user._id;

    loan.statusHistory.push({
      status: "under_review",
      changedBy: req.user._id,
      note: "Loan moved to review stage by agent",
      changedAt: new Date(),
    });

    await loan.save();

    try {
      const user = await User.findById(loan.userObjectId);

      if (user?.email) {
        await sendLoanSubmittedEmail({
          to: user.email,
          name: user.name,
          loanId: loan.loanId,
        });
      }
    } catch (emailError) {
      console.error("Email send failed:", emailError.message);
    }

    res.json({
      message: "Loan moved to review successfully",
      loanId: loan.loanId,
      status: loan.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectLoanByAgent = async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (!loan.agentId || loan.agentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!["submitted", "under_review", "documents_pending"].includes(loan.status)) {
      return res.status(400).json({
        message:
          "Only submitted, under review, or documents pending loans can be rejected",
      });
    }

    const remarks = req.body.remarks?.trim();

    if (!remarks) {
      return res.status(400).json({
        message: "Rejection reason is required",
      });
    }

    loan.status = "rejected";
    loan.remarks = remarks;
    loan.lastModifiedBy = req.user._id;

    loan.statusHistory = loan.statusHistory || [];
    loan.statusHistory.push({
      status: "rejected",
      changedBy: req.user._id,
      note: remarks,
      changedAt: new Date(),
    });

    await loan.save();

    res.json({ message: "Loan rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const applyLoan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.body) {
      return res.status(400).json({ message: "Form data not received" });
    }

    const {
      loanType,
      loanAmount,
      companyId,
      companyName,
      location,
      salary,
      netHandSalary,
      fullName,
      mobile,
      email,
      panNumber,
      aadhaarNumber,
      address,
    } = req.body;

    const loanId = await generateLoanId();
    const files = req.files || {};

    const loan = await Loan.create({
      loanId,
      userId: user.userId,
      userObjectId: user._id,
      agentId: null,
      createdBy: req.user._id,
      createdByRole: "user",

      loanDetails: {
        loanType,
        amount: Number(loanAmount),
        submittedByName: fullName,
        mobile,
        email,
      },

      employmentDetails: {
        companyId,
        companyName,
        location,
        salary: Number(salary),
        netHandSalary: Number(netHandSalary),
      },

      kycDetails: {
        panNumber,
        aadharNumber: aadhaarNumber,
        address,
        panFile: files.panFile?.[0]?.path || "",
        aadhaarFile: files.aadhaarFile?.[0]?.path || "",
        bankStatements: files.bankStatements?.map((file) => file.path) || [],
        itReturns: files.itReturns?.map((file) => file.path) || [],
        payslips: files.payslips?.map((file) => file.path) || [],
      },

      status: "submitted",
statusHistory: [
  {
    status: "submitted",
    changedBy: req.user._id,
    note: "Loan application submitted by user",
  },
],
    });

    user.documents = user.documents || {};

    if (files.panFile?.[0]) {
      user.documents.panCard = {
        url: files.panFile[0].path.replace(/\\/g, "/"),
        filename: files.panFile[0].originalname,
        uploadedAt: new Date(),
      };
    }

    if (files.aadhaarFile?.[0]) {
      user.documents.aadharCard = {
        url: files.aadhaarFile[0].path.replace(/\\/g, "/"),
        filename: files.aadhaarFile[0].originalname,
        uploadedAt: new Date(),
      };
    }

    if (panNumber) {
      user.panNumber = panNumber;
    }

    if (aadhaarNumber) {
      user.aadharNumber = aadhaarNumber;
    }

    if (address) {
      user.address = address;
    }

    await user.save();

    try {
      const receiverEmail = user.email || email;

      if (receiverEmail) {
        await sendLoanAppliedEmail({
          to: receiverEmail,
          name: user.name || fullName,
          loanId: loan.loanId,
        });
      }
    } catch (emailError) {
      console.error("Apply loan email failed:", emailError.message);
    }

    res.status(201).json({
      message: "Loan application submitted successfully",
      loan,
    });
  } catch (error) {
    console.error("Apply loan error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status, note } = req.body;

    const allowedStatuses = [
      "draft",
      "submitted",
      "under_review",
      "documents_pending",
      "approved",
      "rejected",
      "disbursed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid loan status" });
    }

    if (!note || !note.trim()) {
      return res.status(400).json({
        message: "Note is required before updating loan status",
      });
    }

    const loan = await Loan.findOne({ loanId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (
      req.user.role === "agent" &&
      (!loan.agentId || loan.agentId.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Not allowed to update this loan" });
    }

    loan.status = status;
    loan.lastModifiedBy = req.user._id;

    if (status === "approved") {
      loan.approvedBy = req.user._id;
    }

    loan.statusHistory.push({
      status,
      changedBy: req.user._id,
      note: note.trim(),
      changedAt: new Date(),
    });

    await loan.save();

    try {
      const user = await User.findById(loan.userObjectId);

      if (user?.email) {
        await sendLoanStatusEmail({
          to: user.email,
          name: user.name,
          loanId: loan.loanId,
          status: loan.status,
          note: note.trim(),
        });
      }
    } catch (emailError) {
      console.error("Status email send failed:", emailError.message);
    }

    res.json({
      message: "Loan status updated successfully",
      loanId: loan.loanId,
      status: loan.status,
      statusHistory: loan.statusHistory,
    });
  } catch (error) {
    console.error("Update loan status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};