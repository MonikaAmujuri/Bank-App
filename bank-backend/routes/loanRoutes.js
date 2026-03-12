import express from "express";
import { startLoan } from "../controllers/loanController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { updateLoan, getLoanById, archiveLoan, restoreLoan, submitLoan,
   modifyApprovedLoan, rejectLoanByAgent, applyLoan} from "../controllers/loanController.js";

const router = express.Router();

router.post("/start", 
  protect, 
  authorizeRoles("agent"), 
  startLoan
);
router.put(
  "/:loanId",
  protect,
  authorizeRoles("agent", "admin"),
  updateLoan
);
router.get(
  "/:loanId",
  protect,
  authorizeRoles("agent", "admin"),
  getLoanById
);

router.patch(
  "/:loanId/archive",
  protect,
  authorizeRoles("admin", "agent"),
  archiveLoan
);

router.patch(
  "/:loanId/restore",
  protect,
  authorizeRoles("admin", "agent"),
  restoreLoan
);
router.put(
  "/:loanId/submit",
  protect,
  authorizeRoles("agent"),
  submitLoan
);
router.put("/:loanId/modify", 
  protect, 
  modifyApprovedLoan
);
router.put("/:loanId/reject", 
  protect, 
  rejectLoanByAgent
);
router.post(
  "/apply",
  protect,
  authorizeRoles("user"),
  upload.fields([
    { name: "panFile", maxCount: 1 },
    { name: "aadhaarFile", maxCount: 1 },
    { name: "bankStatements", maxCount: 10 },
    { name: "itReturns", maxCount: 10 },
    { name: "payslips", maxCount: 10 },
  ]),
  applyLoan
);


export default router;