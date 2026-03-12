import bcrypt from "bcryptjs";
import Loan from "../models/Loan.js";
import User from "../models/User.js";
import { generateSecurePassword } from "../utils/generatePassword.js";

export const getAgentDashboard = async (req, res) => {
  try {
    const agentId = req.user._id;

    const totalUsers = await User.countDocuments({
      createdBy: agentId,
      role: "user",
    });

    const totalLoans = await Loan.countDocuments({
      agentId,
      isArchived: false,
    });

    const draftLoans = await Loan.countDocuments({
      agentId,
      status: "draft",
      isArchived: false,
    });

    const approvedLoans = await Loan.countDocuments({
      agentId,
      status: "approved",
      isArchived: false,
    });

    const homeLoans = await Loan.countDocuments({
      agentId,
      isArchived: false,
      "loanDetails.loanType": "home",
    });

    const personalLoans = await Loan.countDocuments({
      agentId,
      isArchived: false,
      "loanDetails.loanType": "personal",
    });

    const educationLoans = await Loan.countDocuments({
      agentId,
      isArchived: false,
      "loanDetails.loanType": "education",
    });

    const vehicleLoans = await Loan.countDocuments({
      agentId,
      isArchived: false,
      "loanDetails.loanType": "vehicle",
    });

    const businessLoans = await Loan.countDocuments({
      agentId,
      isArchived: false,
      "loanDetails.loanType": "business",
    });

    const recentLoans = await Loan.find({
      agentId,
      isArchived: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalLoans,
      draftLoans,
      approvedLoans,
      homeLoans,
      personalLoans,
      educationLoans,
      vehicleLoans,
      businessLoans,
      recentLoans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyUsers = async (req, res) => {
  try {
    const showDeleted = req.query.deleted === "true";

    const users = await User.find({
      createdBy: req.user._id,
      role: "user",
      isDeleted: showDeleted,
    })
      .select("-password")
      .sort({ userId: 1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAgentLoans = async (req, res) => {
  try {
    const { status, archived, type } = req.query;

    const filter = {
      $and: [
        {
          $or: [
            { agentId: req.user._id },
            { createdByRole: "user", status: "pending", agentId: null },
          ],
        },
      ],
    };

    if (archived === "true") {
      filter.$and.push({ isArchived: true });
    } else {
      filter.$and.push({
        $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
      });
    }

    if (status) {
      filter.$and.push({ status });
    }

    if (type) {
      filter.$and.push({ "loanDetails.loanType": type });
    }

    const loans = await Loan.find(filter)
      .populate("userObjectId", "name userId isDeleted")
      .populate("agentId", "name")
      .sort({ loanId: 1 });

    res.json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateAgentProfile = async (req, res) => {
  try {
    const agent = await User.findById(req.user._id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.name = req.body.name || agent.name;
    agent.phone = req.body.phone || agent.phone;

    await agent.save();

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const resetUserPasswordByAgent = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPlainPassword = generateSecurePassword(12);
    const hashedPassword = await bcrypt.hash(newPlainPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
      newPassword: newPlainPassword,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAgentUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      role: "user",
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const loans = await Loan.find({
      userObjectId: user._id,
      agentId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      user,
      loans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateAgentUser = async (req, res) => {
  try {
    const { name, email, phone, panNumber, aadharNumber, address } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.phone = phone ?? user.phone;
    user.panNumber = panNumber ?? user.panNumber;
    user.aadharNumber = aadharNumber ?? user.aadharNumber;
    user.address = address ?? user.address;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
