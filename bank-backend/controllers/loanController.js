import Loan from "../models/Loan.js";
import User from "../models/User.js";
import { generateLoanId } from "../utils/generateLoanId.js";

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
      kycDetails: {
        aadharNumber: user.aadharNumber || "",
        panNumber: user.panNumber || "",
        address: user.address || "",
      },
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

    // If agent → only their loans
    if (
      req.user.role === "agent" &&
      loan.agentId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed to update this loan" });
    }

    if (loan.status !== "draft" && req.user.role !== "admin") {
      return res.status(400).json({ message: "Loan cannot be edited now" });
    }

    // Allowed sections
    const allowedSections = ["loanDetails", "employmentDetails", "kycDetails"];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({ message: "Invalid section" });
    }

    /* ================= VALIDATION START ================= */

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

    /* ================= VALIDATION END ================= */

    loan[section] = {
      ...loan[section],
      ...normalizedData,
    };
    if (req.user.role === "admin") {
      loan.lastModifiedBy = req.user._id;
    }
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
  .populate("lastModifiedBy", "name role");

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

    if (loan.agentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (loan.status !== "draft") {
      return res.status(400).json({ message: "Already submitted" });
    }

    loan.status = "approved";
    loan.approvedBy = req.user._id; // optional but professional 
    await loan.save();

    res.json({ message: "Loan submitted successfully" });

  } catch (error) {
    console.error(error); // keep this for debugging
    res.status(500).json({ message: "Server error" });
  }
};
export const modifyApprovedLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status !== "approved") {
      return res.status(400).json({ message: "Only approved loans can be modified" });
    }

    loan.status = "draft";
    loan.approvedBy = null;
    loan.remarks = "Modified after approval";

    await loan.save();

    res.json({ message: "Loan reopened for modification" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const rejectLoanByAgent = async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status !== "pending") {
      return res.status(400).json({
        message: "Only pending loans can be rejected",
      });
    }

    loan.status = "rejected";
    loan.remarks = req.body.remarks || "Rejected by agent";

    await loan.save();

    res.json({ message: "Loan rejected successfully" });

  } catch (error) {
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

      status: "pending",
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

    res.status(201).json({
      message: "Loan application submitted successfully",
      loan,
    });
  } catch (error) {
    console.error("Apply loan error:", error);
    res.status(500).json({ message: "Server error" });
  }
};