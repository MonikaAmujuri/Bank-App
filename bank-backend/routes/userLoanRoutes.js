import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  getMyLoans,
  getMyLoanDetails,
  getUserDocuments,
  uploadPanCard,
  uploadAadharCard,
  updateMyLoan
} from "../controllers/userLoanController.js";


const router = express.Router();

router.get(
  "/my-loans",
  protect,
  authorizeRoles("user"),
  getMyLoans
);

router.get(
  "/my-loans/:loanId",
  protect,
  authorizeRoles("user"),
  getMyLoanDetails
);

router.get(
  "/documents",
  protect,
  authorizeRoles("user"),
  getUserDocuments
);

router.put(
  "/documents/pan",
  protect,
  authorizeRoles("user"),
  upload.single("document"),
  uploadPanCard
);

router.put(
  "/documents/aadhar",
  protect,
  authorizeRoles("user"),
  upload.single("document"),
  uploadAadharCard
);

router.put(
  "/my-loans/:loanId",
  protect,
  authorizeRoles("user"),
  upload.fields([
    { name: "panFile", maxCount: 1 },
    { name: "aadhaarFile", maxCount: 1 },
    { name: "bankStatements", maxCount: 10 },
    { name: "itReturns", maxCount: 10 },
    { name: "payslips", maxCount: 10 },
  ]),
  updateMyLoan
);

export default router;
