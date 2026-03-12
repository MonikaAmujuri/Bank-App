import express from "express";
import { loginUser, firebaseLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/firebase-login", firebaseLogin);

export default router;