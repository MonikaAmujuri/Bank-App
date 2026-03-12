import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createUser, deleteUserByAgent, restoreUserByAgent, getMyProfile, updateMyProfile } from "../controllers/userController.js";

const router = express.Router();

router.post(
  "/create-user",
  protect,
  authorizeRoles("agent"),
  createUser
);

router.put("/:id/delete", 
  protect, 
  deleteUserByAgent
);

router.put("/:id/restore", 
  protect, 
  restoreUserByAgent
);
router.get("/me", 
  protect, 
  authorizeRoles("user"), 
  getMyProfile
);
router.put("/me", 
  protect, 
  authorizeRoles("user"), 
  updateMyProfile
);

export default router;