import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getAgentDashboard, getMyUsers, getAgentLoans, updateAgentProfile, resetUserPasswordByAgent, getAgentUserDetails, updateAgentUser } from "../controllers/agentController.js";


const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("agent"),
  getAgentDashboard
);

router.get(
  "/users",
  protect,
  authorizeRoles("agent"),
  getMyUsers
);

router.get(
  "/loans",
  protect,
  authorizeRoles("agent"),
  getAgentLoans
);

router.put("/profile", 
  protect, 
  authorizeRoles("agent"),
  updateAgentProfile
);
router.put("/users/:id/reset-password", 
  protect, 
  authorizeRoles("agent"), 
  resetUserPasswordByAgent
);

router.get("/users/:id/details", 
  protect, 
  authorizeRoles("agent"), 
  getAgentUserDetails
);
router.put("/users/:id", 
  protect, 
  authorizeRoles("agent"), 
  updateAgentUser
);


export default router;