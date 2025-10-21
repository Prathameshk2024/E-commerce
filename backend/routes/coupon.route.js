import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon , validateCoupon, generateTestCoupon, createUniversalCoupon} from "../controllers/coupon.controller.js";
const router = express.Router();

router.get("/",protectRoute,getCoupon)
router.post("/validate",protectRoute,validateCoupon)
router.post("/generate-test",protectRoute,generateTestCoupon)
router.post("/create-universal",protectRoute,createUniversalCoupon)

export default router;