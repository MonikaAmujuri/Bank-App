import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateSecurePassword } from "../utils/generatePassword.js";
import { generateUserId } from "../utils/generateUserId.js";

const generateAgentId = async () => {
  const lastAgent = await User.findOne({ role: "agent" }).sort({ createdAt: -1 });

  let newAgentNumber = 1;

  if (lastAgent && lastAgent.agentId) {
    const lastNumber = parseInt(lastAgent.agentId.replace("AGT", ""), 10);
    if (!Number.isNaN(lastNumber)) {
      newAgentNumber = lastNumber + 1;
    }
  }

  return `AGT${String(newAgentNumber).padStart(4, "0")}`;
};

export const createAgent = async (req, res) => {
  try {
    const { name, email, phone, location, pincode } = req.body;

    // Check if agent already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate secure password
    const plainPassword = generateSecurePassword(12);

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Generate next agent id on demand
    const agentId = await generateAgentId();

    // Create agent
    const agent = await User.create({
      name,
      email,
      phone,
      location,
      pincode,
      agentId,
      password: hashedPassword,
      role: "agent",
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Agent created successfully",
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        location: agent.location,
        pincode: agent.pincode,
        agentId: agent.agentId,
        role: agent.role,
      },
      password: plainPassword, // Returned once
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, panNumber, aadharNumber, address } = req.body;
    const userId = await generateUserId();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate secure password
    const plainPassword = generateSecurePassword(12);

    // Hash password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create user
    const user = await User.create({
      userId,
      name,
      email,
      phone,
      panNumber,
      aadharNumber,
      address,
      password: hashedPassword,
      role: "user",
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        panNumber: user.panNumber,
        aadharNumber: user.aadharNumber,
        address: user.address,
        role: user.role,
      },
      password: plainPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteUserByAgent = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = true;
    await user.save();

    res.json({ message: "User removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const restoreUserByAgent = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = false;
    await user.save();

    res.json({ message: "User restored successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name email mobile phone userId role createdAt panNumber aadharNumber address documents"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateMyProfile = async (req, res) => {
  try {
    const { name, email, mobile, address } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.mobile = mobile ?? user.mobile;
    user.address = address ?? user.address;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};