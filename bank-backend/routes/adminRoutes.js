import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getDashboardStats } from "../controllers/adminController.js";
import { getAllLoans } from "../controllers/adminController.js";
import { getAllAgents, getAllUsers, getAgentDetails } from "../controllers/adminController.js";
import { deactivateUser, activateUser, deleteAgent, resetAgentPassword } from "../controllers/adminController.js";
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from "../controllers/adminController.js";
import { createAgent } from "../controllers/userController.js";
import { assignLoanToAgent } from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getDashboardStats 
);
router.get(
  "/loans",
  protect,
  authorizeRoles("admin"),
  getAllLoans
);
router.post(
  "/create-agent",
  protect,
  authorizeRoles("admin"),
  createAgent
);
router.post(
  "/create-agent",
  protect,
  authorizeRoles("admin"),
  createAgent
);
router.get(
  "/agents",
  protect,
  authorizeRoles("admin"),
  getAllAgents
);

router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);
router.patch(
  "/deactivate/:id",
  protect,
  authorizeRoles("admin"),
  deactivateUser
);
router.patch(
  "/activate/:id",
  protect,
  authorizeRoles("admin"),
  activateUser
);
router.get(
  "/agent/:agentId/details",
  protect,
  authorizeRoles("admin"),
  getAgentDetails
);
router.delete(
  "/agents/:id",
  protect,
  authorizeRoles("admin"),
  deleteAgent
);
router.patch(
  "/agents/:id/reset-password",
   protect, 
   authorizeRoles("admin"), 
   resetAgentPassword
);
router.get("/profile",
   protect, 
   authorizeRoles("admin"), 
   getAdminProfile
);
router.put("/profile", 
  protect, 
  authorizeRoles("admin"), 
  updateAdminProfile
);
router.patch("/change-password",
  protect, 
  authorizeRoles("admin"), 
  changeAdminPassword
);

router.patch(
  "/loans/:loanId/assign-agent",
  protect,
  authorizeRoles("admin"),
  assignLoanToAgent
);

export default router;