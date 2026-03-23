import express from "express";
import {
  checkAuth,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/authController";
import { authenticateJwt } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/check-auth", authenticateJwt, checkAuth);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

export default router;
