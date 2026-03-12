import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Loan from "../models/Loan.js";


export const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({ role: "user" });
    const agentsCount = await User.countDocuments({
      role: "agent",
      isDeleted: false,
    });
    const loansCount = await Loan.countDocuments();
    const homeLoans = await Loan.countDocuments({
      "loanDetails.loanType": "home",
      isArchived: false,
    });

    const personalLoans = await Loan.countDocuments({
      "loanDetails.loanType": "personal",
      isArchived: false,
    });

    const educationLoans = await Loan.countDocuments({
      "loanDetails.loanType": "education",
      isArchived: false,
    });

    const businessLoans = await Loan.countDocuments({
      "loanDetails.loanType": "business",
      isArchived: false,
    });

    const vehicleLoans = await Loan.countDocuments({
      "loanDetails.loanType": "vehicle",
      isArchived: false,
    });

    res.json({
      users: usersCount,
      agents: agentsCount,
      loans: loansCount,
      homeLoans: homeLoans,
      personalLoans: personalLoans,
      educationLoans: educationLoans,
      businessLoans: businessLoans,
      vehicleLoans: vehicleLoans,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllLoans = async (req, res) => {
  try {
    const { loanType, showArchived } = req.query;
    const filter = {};

    if (showArchived === "true") {
      filter.isArchived = true;
    } else {
      filter.$or = [{ isArchived: false }, { isArchived: { $exists: false } }];
    }

    if (loanType) {
      filter["loanDetails.loanType"] = loanType;
    }

    const loans = await Loan.find(filter)
      .populate("userObjectId", "name userId")
      .populate("agentId", "name")
      .sort({ loanId: 1 });

    res.status(200).json(loans);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({
      role: "agent",
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
    })
      .select("-password")
      .sort({ agentId: 1 });

    res.status(200).json(agents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ userId: 1 });

    const usersWithLoanType = await Promise.all(
      users.map(async (user) => {
        const latestLoan = await Loan.findOne({
          userObjectId: user._id,
          isArchived: false,
        }).sort({ loanId: 1 });

        return {
          ...user.toObject(),
          loanType: latestLoan?.loanDetails?.loanType || "-",
        };
      })
    );

    res.status(200).json(usersWithLoanType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot deactivate admin" });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot modify admin" });
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAgentDetails = async (req, res) => {
  try {
    const { agentId } = req.params;

    const users = await User.find({
      createdBy: agentId,
      role: "user",
    }).select("-password");

    const totalLoans = await Loan.countDocuments({
      agentId: agentId,
    });

    const approvedLoans = await Loan.countDocuments({
      agentId: agentId,
      status: "approved",
    });

    const approvalRate =
      totalLoans > 0
        ? ((approvedLoans / totalLoans) * 100).toFixed(1)
        : 0;

    const usersWithLoanType = await Promise.all(
      users.map(async (user) => {
        const latestLoan = await Loan.findOne({
          userObjectId: user._id,
          isArchived: false,
        }).sort({ createdAt: -1 });

        return {
          ...user.toObject(),
          loanType: latestLoan?.loanDetails?.loanType || "-",
        };
      })
    );
    res.status(200).json({
      totalUsers: users.length,
      totalLoans,
      approvedLoans,
      approvalRate,
      users: usersWithLoanType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await User.findById(id);

    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found" });
    }

    agent.isDeleted = true;
    agent.isActive = false;

    await agent.save();

    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const resetAgentPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await User.findById(id);

    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Generate random password
    const newPassword = Math.random().toString(36).slice(-8) + "@A1";

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    agent.password = hashedPassword;
    await agent.save();

    res.json({
      message: "Password reset successfully",
      newPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const admin = await User.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const admin = await User.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const assignLoanToAgent = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: "Agent ID is required" });
    }

    const loan = await Loan.findOne({
      loanId,
      $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    const agent = await User.findOne({
      _id: agentId,
      role: "agent",
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    loan.agentId = agent._id;

    if (loan.status === "pending" && !loan.remarks) {
      loan.remarks = "Assigned by admin";
    }

    await loan.save();

    const updatedLoan = await Loan.findOne({ loanId })
      .populate("userObjectId", "name userId")
      .populate("agentId", "name agentId");

    res.status(200).json({
      message: "Loan assigned successfully",
      loan: updatedLoan,
    });
  } catch (error) {
    console.error("Assign loan to agent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};