import express from "express";
import { login, logout, signup , refreshToken ,getProfile} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

console.log("✅ Auth routes file loaded");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
router.get("/profile", protectRoute, getProfile);
export default router
